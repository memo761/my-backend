const path = require("path");
const dbConnection = require("./DB/dbConnection");
require("dotenv").config({ path: "./config/config.env" });
const orderRouters = require("./routers/order");
const productRouters = require("./routers/product");

const express = require("express");
const app = express();

const port = process.env.PORT;

// إضافة middleware للسماح بـ CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// توصيل بقاعدة البيانات
dbConnection();

// Middleware للتعامل مع البيانات
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// خدمة الملفات الثابتة من مجلد public
app.use(express.static(path.join(__dirname, "public")));

// خدمة الملفات الثابتة من مجلد uploads
app.use("/uploads", express.static("uploads"));

// توجيه API routes
app.use("/api/Orders", orderRouters);
app.use("/api/products", productRouters);

// توجيه المسار الرئيسي إلى index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// معالجة المسارات غير الموجودة
app.use((req, res) => {
  res.status(404).send("الصفحة غير موجودة");
});

app.listen(port, () => {
  console.log(`Server Is Running On PORT ${port}`);
});
