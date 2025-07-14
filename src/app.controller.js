import connectDB from "./db/connectDB.js";
import * as routers from "./modules/index.js";
import { globalErrorHandler, notFoundHandler } from "./utils/index.js";
import cors from "cors";

const bootstrap = async (app, express) => {
  app.use(
    cors({
      origin: [process.env.BASE_URL],
      credentials: true,
    })
  );

  // Connect to database
  await connectDB();

  // Middleware
  app.use(express.json());

  // Routes
  app.use("/", (req, res) => {
    res.send("Welcome to the API");
  });
  app.use("/auth", routers.authRouter);
  app.use("/user", routers.userRouter);
  app.use("/message", routers.messageRouter);

  // Error handler
  app.all("*", notFoundHandler);
  app.use(globalErrorHandler);
};

export default bootstrap;
