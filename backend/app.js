import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./src/routes/userRoutes.js";
import videoRouter from "./src/routes/videoRoutes.js";
import playlistRouter from "./src/routes/playlistRoutes.js";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN_LOCAL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
console.log(process.env.CORS_ORIGIN);

app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/users", userRouter);
app.use("/api/videos", videoRouter);
app.use("/api/playlists", playlistRouter);

export { app };
