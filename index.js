import express from "express";
import dotenv from "dotenv";
import bootstrap from "./src/app.controller.js";
import compression from "compression";

const app = express();
dotenv.config();
app.use(compression());
await bootstrap(app, express);

app.listen(process.env.PORT, () => {
  console.log(`Server running...`);
});
