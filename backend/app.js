import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import videoRouter from "./routes/videoRoutes.js";
import playlistRouter from "./routes/playlistRoutes.js";
import likesRouter from "./routes/likesRoute.js";
import subscriptionsRouter from "./routes/subscriptionRoute.js";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: [
      process.env.CORS_ORIGIN_LOCAL,
      process.env.CORS_ORIGIN,
      process.env.FE_ORIGIN,
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());
app.use("/api/users", userRouter);
app.use("/api/videos", videoRouter);
app.use("/api/playlists", playlistRouter);
app.use("/api/likes", likesRouter);
app.use("/api/subscriptions", subscriptionsRouter);

export { app };
