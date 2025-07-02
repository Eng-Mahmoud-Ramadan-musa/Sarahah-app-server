import multer from "multer";

export const fileValidation = {
  images: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  files: ["application/pdf"],
  videos: ["video/mp4", "video/mpeg", "video/quicktime"],
  audios: ["audio/mp3", "audio/mpeg", "audio/wav"],
};

export const cloudUpload = (allowedTypes) => {
  try {
    const storage = multer.diskStorage({});

    const fileFilter = (req, file, cb) => {
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Invalid file type!"), false);
      }
      return cb(null, true);
    };

    return multer({ storage, fileFilter });
  } catch (error) {
    throw new Error("Failed to initialize file upload middleware: " + error.message);
  }
};
