const express = require("express");
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} = require("../controllers/notifications");

const router = express.Router();
const { protect } = require("../middleware/auth");

// All notification routes require authentication
router.use(protect);

router.route("/").get(getNotifications);
router.route("/unread-count").get(getUnreadCount);
router.route("/read-all").put(markAllAsRead);
router.route("/:id/read").put(markAsRead);
router.route("/:id").delete(deleteNotification);

module.exports = router;
