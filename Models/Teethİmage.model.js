import mongoose from "mongoose";

const TeethImageSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
});

export const TeethImage = mongoose.model("TeethImage", TeethImageSchema);
