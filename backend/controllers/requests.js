const Request = require("../models/Request");
const Product = require("../models/Product");
const Notification = require("../models/Notification");
const User = require("../models/User");

// @desc    Get all requests (Admin only) or user's own requests (Staff)
// @route   GET /api/v1/requests
// @access  Private
exports.getRequests = async (req, res, next) => {
  try {
    let requests;

    // Admin can see all requests, staff can only see their own
    if (req.user.role === "admin") {
      requests = await Request.find()
        .populate("user", "name email role")
        .populate("product_id", "name sku category stockQuantity");
    } else {
      requests = await Request.find({ user: req.user.id })
        .populate("user", "name email role")
        .populate("product_id", "name sku category stockQuantity");
    }

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get request by ID
// @route   GET /api/v1/requests/:id
// @access  Private
exports.getRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate("user", "name email role")
      .populate("product_id", "name sku category stockQuantity");

    if (!request) {
      return res.status(404).json({
        success: false,
        error: "Request not found",
      });
    }

    // Staff can only view their own requests
    if (
      req.user.role === "staff" &&
      request.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to view this request",
      });
    }

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new request
// @route   POST /api/v1/requests
// @access  Private (Staff and Admin)
exports.createRequest = async (req, res, next) => {
  try {
    // Validate stock-out amount limit for staff (admin has no limit)
    if (
      req.user.role === "staff" &&
      req.body.transactionType === "stockOut" &&
      req.body.itemAmount > 50
    ) {
      return res.status(400).json({
        success: false,
        error: "Stock-out amount cannot exceed 50 items",
      });
    }

    // Check if product exists and is active
    const product = await Product.findById(req.body.product_id);
    if (!product || !product.isActive) {
      return res.status(400).json({
        success: false,
        error: "Product not found or inactive",
      });
    }

    // For stock-out, check if sufficient stock is available
    if (
      req.body.transactionType === "stockOut" &&
      product.stockQuantity < req.body.itemAmount
    ) {
      return res.status(400).json({
        success: false,
        error: "Insufficient stock available",
      });
    }

    const request = await Request.create({
      ...req.body,
      user: req.user.id,
      activityLog: [
        {
          action: "created",
          performedBy: req.user.id,
          performedAt: new Date(),
          details: `Created by ${req.user.role}`,
        },
      ],
    });

    const populatedRequest = await Request.findById(request._id)
      .populate("user", "name email role")
      .populate("product_id", "name sku category stockQuantity");

    // If staff creates a request, notify all admins
    if (req.user.role === "staff") {
      const admins = await User.find({ role: "admin" });
      const productName = populatedRequest.product_id.name;
      const productSku = populatedRequest.product_id.sku;
      const transactionTypeLabel =
        populatedRequest.transactionType === "stockIn"
          ? "Stock In"
          : "Stock Out";

      const notificationPromises = admins.map((admin) =>
        Notification.create({
          recipient: admin._id,
          sender: req.user.id,
          type: "request_created",
          title: "New request requires your attention",
          message: `${req.user.name} created a new ${transactionTypeLabel} request for ${productName} (${productSku}) - Quantity: ${populatedRequest.itemAmount} units`,
          relatedRequest: request._id,
          relatedProduct: req.body.product_id,
        })
      );
      await Promise.all(notificationPromises);
    }

    res.status(201).json({
      success: true,
      data: populatedRequest,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update request
// @route   PUT /api/v1/requests/:id
// @access  Private
exports.updateRequest = async (req, res, next) => {
  try {
    let request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: "Request not found",
      });
    }

    // Staff can only edit their own requests
    if (req.user.role === "staff" && request.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to edit this request",
      });
    }

    // Validate stock-out amount limit for staff
    if (
      req.user.role === "staff" &&
      req.body.transactionType === "stockOut" &&
      req.body.itemAmount > 50
    ) {
      return res.status(400).json({
        success: false,
        error: "Stock-out amount cannot exceed 50 items",
      });
    }

    // Track who modified the request
    const updatedData = {
      ...req.body,
      lastModifiedBy: req.user.id,
    };

    // Add activity log entry
    request.activityLog.push({
      action: "updated",
      performedBy: req.user.id,
      performedAt: new Date(),
      details: `Updated by ${req.user.role}`,
    });

    await request.save();

    request = await Request.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    })
      .populate("user", "name email role")
      .populate("lastModifiedBy", "name role")
      .populate("product_id", "name sku");

    const isAdminUpdatingStaffRequest =
      req.user.role === "admin" && request.user._id.toString() !== req.user.id;

    // Create notification if admin updates staff request
    if (isAdminUpdatingStaffRequest) {
      const productName =
        typeof request.product_id === "object"
          ? request.product_id.name
          : "Unknown Product";
      const productSku =
        typeof request.product_id === "object" ? request.product_id.sku : "";
      const transactionTypeLabel =
        request.transactionType === "stockIn" ? "Stock In" : "Stock Out";

      await Notification.create({
        recipient: request.user._id,
        sender: req.user.id,
        type: "request_updated",
        title: "Your request has been updated",
        message: `Admin ${req.user.name} updated your ${transactionTypeLabel} request for ${productName} (${productSku}) - Quantity: ${request.itemAmount} units`,
        relatedRequest: request._id,
        relatedProduct: request.product_id,
      });
    }

    res.status(200).json({
      success: true,
      data: request,
      notification: isAdminUpdatingStaffRequest
        ? {
            action: "updated",
            performedBy: req.user.name,
            performedByRole: "admin",
            requestOwner: request.user.name,
            timestamp: new Date(),
          }
        : null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete request
// @route   DELETE /api/v1/requests/:id
// @access  Private (Admin can delete any, Staff can delete own)
exports.deleteRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate("user", "name email role")
      .populate("product_id", "name sku");

    if (!request) {
      return res.status(404).json({
        success: false,
        error: "Request not found",
      });
    }

    // Staff can only delete their own requests, Admin can delete any
    if (
      req.user.role === "staff" &&
      request.user._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this request",
      });
    }

    const isAdminDeletingStaffRequest =
      req.user.role === "admin" && request.user.role === "staff";
    const deletedByName = req.user.name || "Admin";
    const requestOwnerName = request.user.name || "User";

    // Prepare detailed request information for notification
    const productName =
      typeof request.product_id === "object"
        ? request.product_id.name
        : "Unknown Product";
    const productSku =
      typeof request.product_id === "object" ? request.product_id.sku : "";
    const transactionTypeLabel =
      request.transactionType === "stockIn" ? "Stock In" : "Stock Out";

    // Create notification if admin deletes staff request
    if (isAdminDeletingStaffRequest) {
      await Notification.create({
        recipient: request.user._id,
        sender: req.user.id,
        type: "request_deleted",
        title: "Your request has been deleted",
        message: `Admin ${deletedByName} deleted your ${transactionTypeLabel} request for ${productName} (${productSku}) - ${
          request.itemAmount
        } units. Request date: ${new Date(
          request.transactionDate
        ).toLocaleDateString()}`,
        relatedProduct: request.product_id,
      });
    }

    await Request.findByIdAndDelete(req.params.id);

    let message = "Request deleted successfully";
    if (isAdminDeletingStaffRequest) {
      message = `Admin (${deletedByName}) deleted request from ${requestOwnerName}`;
    }

    res.status(200).json({
      success: true,
      data: {},
      message: message,
      notification: isAdminDeletingStaffRequest
        ? {
            action: "deleted",
            performedBy: deletedByName,
            performedByRole: "admin",
            requestOwner: requestOwnerName,
            timestamp: new Date(),
          }
        : null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel request
// @route   POST /api/v1/requests/:id/cancel
// @access  Private
exports.cancelRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: "Request not found",
      });
    }

    // Staff can only cancel their own requests
    if (req.user.role === "staff" && request.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to cancel this request",
      });
    }

    // Only pending requests can be cancelled
    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        error: "Only pending requests can be cancelled",
      });
    }

    request.status = "cancelled";
    await request.save();

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve request (Admin only)
// @route   POST /api/v1/requests/:id/approve
// @access  Private (Admin only)
exports.approveRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: "Request not found",
      });
    }

    // Only admin can approve requests
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Only admin can approve requests",
      });
    }

    // Only pending requests can be approved
    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        error: "Only pending requests can be approved",
      });
    }

    request.status = "approved";
    request.approvedBy = req.user.id;
    request.approvedAt = Date.now();
    await request.save();

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject request (Admin only)
// @route   POST /api/v1/requests/:id/reject
// @access  Private (Admin only)
exports.rejectRequest = async (req, res, next) => {
  try {
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        error: "Rejection reason is required",
      });
    }

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: "Request not found",
      });
    }

    // Only admin can reject requests
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Only admin can reject requests",
      });
    }

    // Only pending requests can be rejected
    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        error: "Only pending requests can be rejected",
      });
    }

    request.status = "rejected";
    request.rejectionReason = rejectionReason;
    request.approvedBy = req.user.id;
    request.approvedAt = Date.now();
    await request.save();

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
};
