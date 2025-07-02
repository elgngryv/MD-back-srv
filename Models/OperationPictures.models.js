import mongoose from "mongoose";

const OperationPicturesSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
});

export const OperationPictures = mongoose.model(
  "OperationPictures",
  OperationPicturesSchema
);
