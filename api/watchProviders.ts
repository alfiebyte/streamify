import type { VercelRequest, VercelResponse } from "@vercel/node";
import { watchProviders, TMDB_IMAGE_BASE } from "./_lib/tmdb.js";
import type {
    TmdbWatchProvider,
    WatchProviderLogo,
} from "../types/Tmdb.js";

function toLogos(providers: TmdbWatchProvider[] = []): WatchProviderLogo[] {
    return [...providers]
        .sort((a, b) => a.display_priority - b.display_priority)
        .map((provider) => ({
            id: provider.provider_id,
            name: provider.provider_name,
            logo: TMDB_IMAGE_BASE + "/w92" + provider.logo_path,
        }));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "GET") {
        return res
            .status(405)
            .json({ success: false, message: "Method not allowed" });
    }

    const type = req.query.type === "series" ? "series" : "movie";
    const id = Number(req.query.id);
    const region = String(req.query.region ?? "US").toUpperCase();

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ success: false, message: "Invalid id" });
    }

    try {
        const response = await watchProviders(type, id);

        res.setHeader(
            "Cache-Control",
            "s-maxage=3600, stale-while-revalidate=86400",
        );

        const data = response.data.results[region];

        return res.status(200).json({
            success: true,
            link: data?.link ?? "",
            flatrate: toLogos(data?.flatrate),
            rent: toLogos(data?.rent),
            buy: toLogos(data?.buy),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch watch providers",
        });
    }
}
