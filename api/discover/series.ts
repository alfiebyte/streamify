// api/discover/[kind].ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { movieDiscover, seriesDiscover } from "../_lib/tmdb.js";
import tmdbToCard from "../_lib/mapToCard.js";
import type {
    DiscoverTvParams,
} from "../../types/TmdbDiscover.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "GET") {
        return res
            .status(405)
            .json({ success: false, message: "Method not allowed" });
    }

    try {
        const response = await seriesDiscover(req.query as DiscoverTvParams)

        res.setHeader(
            "Cache-Control",
            "s-maxage=300, stale-while-revalidate=600",
        );

        const cardPromises = response.data.results.map((result) =>
            tmdbToCard("series", result),
        );
        const results = await Promise.all(cardPromises);

        return res.status(200).json({
            success: true,
            items: results,
            page: response.data.page,
            totalPages: response.data.total_pages,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: `Failed to fetch discover for movie`,
        });
    }
}