import type { TmdbImage, TmdbImagesResult, TmdbResult } from "types/Tmdb";
import type { CardInterface, CardType } from "types/Card";

import { movieImages, seriesImages } from "./tmdb";

import { TMDB_IMAGE_BASE } from "./tmdb";

export function handleImages(
    imagesResult: TmdbImagesResult,
): [thumbnails: Array<TmdbImage | undefined>, backdrops: Array<TmdbImage | undefined>] {
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
            const [thumbnails] = handleImages(images.data)
            
            const thumbnailPath = thumbnails[0]?.file_path ?? tmdb.backdrop_path

            resolve({
                type: type,
                title: tmdb.title,
                description: tmdb.overview,
                thumbnail: TMDB_IMAGE_BASE + "/w780" + thumbnailPath,
                rating: tmdb.vote_average,
                year: new Date(tmdb.release_date).getFullYear(),
                runTime: 0,
            });
        } catch (error) {
            reject(error);
        }
    });
}
