import type { VercelRequest, VercelResponse } from "@vercel/node";
import { movieDetails, seriesDetails } from "../_lib/tmdb";
import type { TitleDetailsResponse } from "types/Tmdb";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "GET") {
        return res
            .status(405)
            .json({ success: false, message: "Method not allowed" });
    }

    const type = req.query.type === "series" ? "series" : "movie";
    const id = Number(req.query.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ success: false, message: "Invalid id" });
    }

    try {
        res.setHeader(
            "Cache-Control",
            "s-maxage=3600, stale-while-revalidate=86400",
        );

        if (type === "movie") {
            const response = await movieDetails(id);
            const details: TitleDetailsResponse = {
                runtime: response.data.runtime ?? 0,
            };
            return res.status(200).json({ success: true, ...details });
        }

        const response = await seriesDetails(id);
        const details: TitleDetailsResponse = {
            seasons: response.data.seasons
                .filter((season) => season.season_number > 0 && season.episode_count > 0)
                .map((season) => ({
                    number: season.season_number,
                    name: season.name,
                    episodeCount: season.episode_count,
                })),
        };
        return res.status(200).json({ success: true, ...details });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch details",
        });
    }
}
