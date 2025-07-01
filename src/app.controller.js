import connectDB from "./db/connectDB.js";
import * as routers from "./modules/index.js";
import { globalErrorHandler, notFoundHandler } from "./utils/index.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cors from "cors";

const bootstrap = async (app, express) => {
  const allowedOrigins = [process.env.BASE_URL];
  app.use(cors({
    origin: function (origin, callback) {
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // لو كنت تستخدم كوكيز
  }));
  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Connect to database
  await connectDB();

  // Middleware
  app.use(express.json());

  // Routes
  app.use("/auth", routers.authRouter);
  app.use("/user", routers.userRouter);
  app.use("/message", routers.messageRouter);

  // Static files for uploads
  const uploadsPath = path.join(__dirname, "..", "uploads");
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath);
  }

  // Serve static files dynamically based on `src` parameter
  app.get("/uploads/:src", (req, res, next) => {
    const filePath = path.join(uploadsPath, req.params.src);

    // Check if file exists
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath); // Serve the file
    } else {
      return res
        .status(404)
        .json({ success: false, message: "File not found!" });
    }
  });
  app.get("/uploads", (req, res, next) => {
    const uploadsPath = path.join(__dirname, "..", "uploads");

    // تحقق من وجود المجلد
    if (fs.existsSync(uploadsPath)) {
      // قراءة ملفات المجلد
      const files = fs.readdirSync(uploadsPath);

      // إذا كانت المجلد يحتوي على ملفات، أرسلها للمستخدم
      if (files.length > 0) {
        return res.status(200).json({ success: true, files: files });
      } else {
        return res
          .status(404)
          .json({
            success: false,
            message: "No files found in the uploads folder!",
          });
      }
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Uploads folder not found!" });
    }
  });
  // Error handler
  app.all("*", notFoundHandler);
  app.use(globalErrorHandler);
};

export default bootstrap;
