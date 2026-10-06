import express, { type Request, type Response, type NextFunction } from "express";
import { movieListNowPlaying } from "./tmdb";

const app = express();
const apiRouter = express.Router();

apiRouter.get("/now_playing", (req, res, next) => {
  movieListNowPlaying({})
    .then((response) => {
      res.json(response.data);
    })
    .catch(next);
});

app.use("/api", apiRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;