import connectDB from "./db/connectDB.js";
import * as routers from "./modules/index.js";
import { globalErrorHandler, notFoundHandler } from "./utils/index.js";
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
  

  // Connect to database
  await connectDB();

  // Middleware
  app.use(express.json());

  // Routes
  app.use("/auth", routers.authRouter);
  app.use("/user", routers.userRouter);
  app.use("/message", routers.messageRouter);

  // Error handler
  app.all("*", notFoundHandler);
  app.use(globalErrorHandler);
};

export default bootstrap;
