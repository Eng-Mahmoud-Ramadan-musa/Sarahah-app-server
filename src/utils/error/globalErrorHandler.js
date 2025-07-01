import fs from "fs";
import path from "path";

const globalErrorHandler = (error, req, res, next) => {
  if (req.file) {
    fs.unlinkSync(path.resolve(req.file.path));
  }
  const status = error.cause || 500;
  return res.status(status).json({
    success: false,
    message: error.message || error,
    ...(process.env.NODE_ENV !== "production" && { stack: error.stack }),
  });
};

export default globalErrorHandler;
