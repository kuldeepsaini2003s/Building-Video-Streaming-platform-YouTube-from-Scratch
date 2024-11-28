import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./src/./routes/userRoutes.js";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/users", userRouter);

export { app };
