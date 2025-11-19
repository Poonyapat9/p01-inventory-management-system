const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });

async function viewProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const ProductSchema = new mongoose.Schema({
      name: String,
      sku: String,
      description: String,
      category: String,
      price: Number,
      stockQuantity: Number,
      unit: String,
      picture: String,
      isActive: Boolean,
      createdAt: Date,
      updatedAt: Date,
    });

    const Product = mongoose.model("Product", ProductSchema);

    const products = await Product.find({});

    console.log("\n📦 Products in MongoDB:\n");
    console.log("Total:", products.length);
    console.log("=====================================\n");

    if (products.length === 0) {
      console.log("No products found. Create some products to see them here!");
    } else {
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   SKU: ${product.sku}`);
        console.log(`   Category: ${product.category}`);
        console.log(`   Price: $${product.price}`);
        console.log(`   Stock: ${product.stockQuantity} ${product.unit}`);
        console.log(`   Active: ${product.isActive}`);
        console.log(
          `   Has Image: ${
            product.picture
              ? product.picture.startsWith("data:")
                ? "Yes (Base64)"
                : "Yes (URL)"
              : "No"
          }`
        );
        console.log(`   ID: ${product._id}`);
        console.log("");
      });
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

viewProducts();
