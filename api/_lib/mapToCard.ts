import type { TmdbImage, TmdbImagesResult, TmdbResult } from "../../types/Tmdb.js";
import type { CardInterface, CardType } from "../../types/Card.js";

import { movieImages, seriesImages } from "./tmdb.js";

import { TMDB_IMAGE_BASE } from "./tmdb.js";

const GENRE_NAMES: Record<number, string> = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
    10759: "Action & Adventure",
    10762: "Kids",
    10763: "News",
    10764: "Reality",
    10765: "Sci-Fi & Fantasy",
    10766: "Soap",
    10767: "Talk",
    10768: "War & Politics",
};

export function handleImages(
    imagesResult: TmdbImagesResult,
): [
    thumbnails: Array<TmdbImage | undefined>,
    backdrops: Array<TmdbImage | undefined>,
] {
    const images = imagesResult.backdrops;
    const thumbnails = images
        .sort((a, b) => b.vote_average - a.vote_average)
        .filter((image) => image.iso_639_1 == "en");
    const backdrops = images
        .sort((a, b) => b.vote_count - a.vote_count)
        .filter((image) => image.iso_639_1 == null);
    return [thumbnails, backdrops];
}

export default function tmdbToCard(
    type: CardType,
    tmdb: TmdbResult,
): Promise<CardInterface> {
    return new Promise(async (resolve, reject) => {
        try {
            const cardImages =
                type === "movie"
                    ? movieImages
                    : type === "series"
                      ? seriesImages
                      : null;

            if (!cardImages) return reject("cardImages undefined");
            const images = await cardImages(tmdb.id);
            const [thumbnails] = handleImages(images.data);

            const thumbnailPath =
                thumbnails[0]?.file_path ?? tmdb.backdrop_path;

            resolve({
                id: tmdb.id,
                type: type,
                title: tmdb.title ?? tmdb.name ?? "",
                description: tmdb.overview,
                thumbnail: TMDB_IMAGE_BASE + "/w780" + thumbnailPath,
                rating: tmdb.vote_average,
                year: new Date(
                    tmdb.release_date ?? tmdb.first_air_date ?? "",
                ).getFullYear(),
                runTime: 0,
                genres: (tmdb.genre_ids ?? [])
                    .map((id) => GENRE_NAMES[id])
                    .filter((genre) => !!genre),
            });
        } catch (error) {
            reject(error);
        }
    });
}
