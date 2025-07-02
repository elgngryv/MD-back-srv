import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// ROUTES
import operationPicturesRoute from "./routes/operationPictures.routes.js";
import teethImageRoute from "./routes/teethImage.routes.js";

// ENV
dotenv.config();

// APP setup
const app = express();

const PORT = process.env.PORT || 8000;
const MONGODB_URL = process.env.MONGODB_URL;

// Middleware-lər
app.use(
  cors({
    origin: ["http://localhost:5173", "http://başqa-domain.com"],
  })
);
app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "Server işləyir" });
});

// Route-lar
app.use("/api/operation-pictures", operationPicturesRoute);
app.use("/api/teeth-images", teethImageRoute);

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("✅ MongoDB bağlantısı uğurla quruldu");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB bağlantısı xətası:", err);
  });
