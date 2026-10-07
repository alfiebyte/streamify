import express, { type Request, type Response, type NextFunction } from "express";

const app = express();

const apiRouter = express.Router();

import healthRouter from "./routes/health";
import nowPlayingRouter from "./routes/now_playing";

app.use(express.json());

apiRouter.use("/health", healthRouter);
apiRouter.use("/now_playing", nowPlayingRouter);

apiRouter.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Not found" });
});

apiRouter.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

app.use("/api", apiRouter);

export default app;