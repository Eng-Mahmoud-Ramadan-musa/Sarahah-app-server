import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";

// كائن يحتوي على أنواع الملفات المدعومة
export const fileValidation = {
  images: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  files: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  videos: ["video/mp4", "video/mpeg", "video/quicktime"],
  audios: ["audio/mp3", "audio/mpeg", "audio/wav"],
};

// دالة لرفع الملفات مع التحقق من النوع
export const fileUpload = (allowedTypes) => {
  // إعدادات التخزين
  const storage = diskStorage({
    destination: "uploads/", // المجلد الذي سيتم تخزين الملفات فيه
    filename: (req, file, cb) => {
      cb(null, nanoid() + "_" + file.originalname); // إضافة معرف فريد لكل ملف
    },
  });

  // التحقق من نوع الملف
  const fileFilter = (req, file, cb) => {
    // تحقق مما إذا كان نوع الملف المدخل ضمن الأنواع المسموح بها
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // إذا كان النوع مسموحًا به، يتم قبول الملف
    } else {
      cb(new Error("Invalid file type!"), false); // إذا كان النوع غير مسموح به، يتم رفضه
    }
  };

  // إرجاع إعدادات multer
  return multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } }); // 2MB
};
