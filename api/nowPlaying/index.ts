import type { VercelRequest, VercelResponse } from "@vercel/node";
import { movieListNowPlaying } from "../_lib/tmdb";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const response = await movieListNowPlaying({});
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json({ success: true, data: response.data});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to fetch now playing movies" });
  }
}