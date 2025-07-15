import connectDB from "./db/connectDB.js";
import * as routers from "./modules/index.js";
import { globalErrorHandler, notFoundHandler } from "./utils/index.js";
import cors from "cors";

const bootstrap = async (app, express) => {
// Connect to DB
await connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.BASE_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(express.json());

// API Routes
app.use("/auth", routers.authRouter);
app.use("/user", routers.userRouter);
app.use("/message", routers.messageRouter);

// Optional home route (keep it last if needed)
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

// Error handlers
app.all("*", notFoundHandler);
app.use(globalErrorHandler);

};

export default bootstrap;
