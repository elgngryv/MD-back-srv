import { TeethImage } from "../Models/Teethİmage.model.js";
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

// CREATE – Yeni şəkli URL-dən qəbul et və Cloudinary-yə yüklə

export const createTeethImage = async (req, res) => {
  try {
    const imageUrl = req.body.image;
    if (!imageUrl) {
      return res.status(400).json({ message: "Şəkil URL tələb olunur!" });
    }

    // Cloudinary-yə yükləmək yerinə sadəcə URL-i yadda saxla
    const newImage = new TeethImage({ image: imageUrl });
    await newImage.save();

    res.status(201).json({
      message: "✅ Şəkil əlavə olundu",
      data: newImage,
    });
  } catch (error) {
    res.status(500).json({ message: "❌ Server xətası", error: error.message });
  }
};

// READ – Bütün şəkilləri gətir
export const getAllTeethImages = async (req, res) => {
  try {
    const images = await TeethImage.find();
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};

// READ – ID ilə tək şəkli gətir
export const getTeethImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await TeethImage.findById(id);

    if (!image) {
      return res.status(404).json({ message: "Şəkil tapılmadı" });
    }

    res.status(200).json(image);
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};

// UPDATE – Şəkli yenilə, Cloudinary-dən köhnəni sil
export const updateTeethImage = async (req, res) => {
  try {
    const { id } = req.params;
    const newImage = req.file?.path || req.body.image;

    if (!newImage) {
      return res.status(400).json({
        message: "Yeni şəkil faylı və ya URL tələb olunur!",
      });
    }

    const existing = await TeethImage.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Şəkil tapılmadı" });
    }

    if (isCloudinaryUrl(existing.image)) {
      const oldPublicId = getPublicIdFromUrl(existing.image);
      if (oldPublicId) {
        await cloudinary.uploader.destroy(oldPublicId);
      }
    }

    let cloudinaryLink = newImage;
    if (!isCloudinaryUrl(newImage)) {
      const uploadResponse = await cloudinary.uploader.upload(newImage, {
        folder: "teeth_images",
      });
      cloudinaryLink = uploadResponse.secure_url;
    }

    existing.image = cloudinaryLink;
    await existing.save();

    res.status(200).json({ message: "Şəkil yeniləndi", data: existing });
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};

// DELETE – Şəkli həm Cloudinary-dən, həm MongoDB-dən sil
export const deleteTeethImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await TeethImage.findById(id);

    if (!image) {
      return res.status(404).json({ message: "Silinəcək şəkil tapılmadı" });
    }

    if (isCloudinaryUrl(image.image)) {
      const publicId = getPublicIdFromUrl(image.image);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await image.deleteOne();

    res.status(200).json({ message: "Şəkil silindi", data: image });
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};
