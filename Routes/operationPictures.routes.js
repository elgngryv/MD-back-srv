import express from "express";
import {
  createOperationPicture,
  getAllOperationPictures,
  getOperationPictureById,
  updateOperationPicture,
  deleteOperationPicture,
} from "../controllers/operationsPictures.controller.js";

const router = express.Router();

router.post("/", createOperationPicture);
router.get("/", getAllOperationPictures);
router.get("/:id", getOperationPictureById);
router.put("/:id", updateOperationPicture);
router.delete("/:id", deleteOperationPicture);

export default router;
