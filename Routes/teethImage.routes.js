import express from "express";
import {
  createTeethImage,
  getAllTeethImages,
  getTeethImageById,
  updateTeethImage,
  deleteTeethImage,
} from "../controllers/TeethImage.controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), createTeethImage); // CREATE şəkil upload ilə
router.get("/", getAllTeethImages);
router.get("/:id", getTeethImageById);
router.put("/:id", upload.single("file"), updateTeethImage);
router.delete("/:id", deleteTeethImage);

export default router;
