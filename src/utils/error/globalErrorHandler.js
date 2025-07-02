
import cloudinary from "../multer/cloud.config.js";

const globalErrorHandler = async (error, req, res, next) => {
   // 🧹 حذف الصورة من Cloudinary إن وُجدت
   if (req.cloudinaryImageId) {
    try {
          // حذف كل الصور داخل المجلد
    await cloudinary.api.delete_resources_by_prefix(folderPath);

    // حذف المجلد نفسه (إن لم يعد يحتوي على ملفات)
    await cloudinary.api.delete_folder(folderPath);
    } catch (err) {
      console.error("Failed to delete image from Cloudinary:", err.message);
    }
  }

  const status = error.cause || 500;
  return res.status(status).json({
    success: false,
    message: error.message || error,
    ...(process.env.NODE_ENV !== "production" && { stack: error.stack }),
  });
};

export default globalErrorHandler;
