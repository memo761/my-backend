const express = require("express");
const router = express.Router();
const upload = require("../middleWares/uploadImage");
const {
  addProduct,
  getAllProducts,
  deleteProduct,
} = require("../controllers/product");

router.post("/add", upload.single("images"), addProduct);

router.get("/", getAllProducts);

router.delete("/delete/:id", deleteProduct);

module.exports = router;
