const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/providers", require("./routes/providerRoutes"));
app.use(
    "/api/providers/documents",
    require("./routes/documentRoutes")
);
app.use(
    "/api/admin",
    require("./routes/adminRoutes")
);
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "ServiceHub API is running",
    });
});

const PORT = process.env.PORT || 5000;
// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: err.message || "File upload error",
    });
  }

  if (err.message) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});