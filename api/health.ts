import type { VercelRequest, VercelResponse } from "@vercel/node";
import { authentication } from "../_lib/tmdb";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    await authentication();
    return res.status(200).json({ success: true, time: new Date().toISOString() });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "TMDB authentication failed" });
  }
}