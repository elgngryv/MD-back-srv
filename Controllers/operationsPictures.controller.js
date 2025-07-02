import { OperationPictures } from "../Models/OperationPictures.models.js";
import { cloudinary } from "../config/cloudinary.js";

const isCloudinaryUrl = (url) => {
  return url && url.includes("res.cloudinary.com");
};

const getPublicIdFromUrl = (url) => {
  try {
    const parts = url.split("/");
    const filenameWithExt = parts.pop();
    const filename = filenameWithExt.split(".")[0];
    const folder = parts.slice(parts.indexOf("upload") + 1).join("/");
    return folder ? `${folder}/${filename}` : filename;
  } catch {
    return null;
  }
};

export const createOperationPicture = async (req, res) => {
  try {
    const imageUrl = req.body.image;

    if (!imageUrl) {
      return res.status(400).json({ message: "Şəkil URL tələb olunur!" });
    }

    const uploadResponse = await cloudinary.uploader.upload(imageUrl, {
      folder: "operation_pictures",
    });

    const cloudinaryLink = uploadResponse.secure_url;

    const newPicture = new OperationPictures({ image: cloudinaryLink });
    await newPicture.save();

    res.status(201).json({
      message: "✅ Şəkil Cloudinary-yə yükləndi və DB-yə əlavə olundu",
      data: newPicture,
    });
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};

export const getAllOperationPictures = async (req, res) => {
  try {
    const pictures = await OperationPictures.find();
    res.status(200).json(pictures);
  } catch (error) {
    res.status(500).json({ message: "❌ Server xətası", error: error.message });
  }
};

export const getOperationPictureById = async (req, res) => {
  try {
    const { id } = req.params;
    const picture = await OperationPictures.findById(id);

    if (!picture) {
      return res.status(404).json({ message: "❌ Şəkil tapılmadı" });
    }

    res.status(200).json(picture);
  } catch (error) {
    res.status(500).json({ message: "❌ Server xətası", error: error.message });
  }
};

export const updateOperationPicture = async (req, res) => {
  try {
    const { id } = req.params;
    const newImage = req.file?.path || req.body.image;

    if (!newImage) {
      return res.status(400).json({
        message: "Yeni şəkil faylı və ya URL tələb olunur!",
      });
    }

    const existing = await OperationPictures.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "❌ Şəkil tapılmadı" });
    }

    if (isCloudinaryUrl(existing.image)) {
      const oldImagePublicId = getPublicIdFromUrl(existing.image);
      if (oldImagePublicId) {
        await cloudinary.uploader.destroy(oldImagePublicId);
      }
    }

    let cloudinaryLink = newImage;
    if (!isCloudinaryUrl(newImage)) {
      const uploadResponse = await cloudinary.uploader.upload(newImage, {
        folder: "operation_pictures",
      });
      cloudinaryLink = uploadResponse.secure_url;
    }

    existing.image = cloudinaryLink;
    await existing.save();

    res.status(200).json({ message: "✅ Şəkil yeniləndi", data: existing });
  } catch (error) {
    res.status(500).json({ message: "❌ Server xətası", error: error.message });
  }
};

export const deleteOperationPicture = async (req, res) => {
  try {
    const { id } = req.params;
    const picture = await OperationPictures.findById(id);

    if (!picture) {
      return res.status(404).json({ message: "❌ Silinəcək şəkil tapılmadı" });
    }

    if (isCloudinaryUrl(picture.image)) {
      const publicId = getPublicIdFromUrl(picture.image);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await picture.deleteOne();

    res.status(200).json({ message: "✅ Şəkil silindi", data: picture });
  } catch (error) {
    res.status(500).json({ message: "❌ Server xətası", error: error.message });
  }
};
