import axios from "axios";

import type {
    MovieListsResponse,
    MovieListsParams,
    AuthenticationResponse,
    TmdbImagesResult,
    TmdbWatchProvidersResult,
    TmdbMovieDetails,
    TmdbSeriesDetails,
} from "types/Tmdb";

import type {
    DiscoverMovieParams,
    DiscoverTvParams,
    MovieDiscover,
    SeriesDiscover,
} from "types/TmdbDiscover";

export const TMDB_BASE = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

const tmdbRequest = axios.create({
    baseURL: TMDB_BASE,
    headers: { accept: "application/json" },
    timeout: 15000,
});

tmdbRequest.interceptors.request.use((config) => {
    const tmdbToken = process.env.TMDB_ACCESS_TOKEN;
    if (!tmdbToken) throw new Error(`TMDB_ACCESS_TOKEN not set`);

    config.headers.set("Authorization", `Bearer ${tmdbToken}`);
    return config;
});

const RETRY_DELAY_MS = 500;
const retriedConfigs = new WeakSet<object>();

tmdbRequest.interceptors.response.use(
    (response) => response,
    async (error) => {
        const requestConfig = error.config;
        const statusCode = error.response?.status;
        const isRetryable =
            error.code === "ECONNABORTED" ||
            error.code === "ETIMEDOUT" ||
            statusCode === 429 ||
            (statusCode !== undefined && statusCode >= 500);

        if (!requestConfig || !isRetryable || retriedConfigs.has(requestConfig))
            return Promise.reject(error);

        retriedConfigs.add(requestConfig);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        return tmdbRequest.request(requestConfig);
    },
);

const ONE_MINUTE_MS = 60 * 1000;
const DEFAULT_CACHE_TTL_MS = 5 * ONE_MINUTE_MS;
const STATIC_CACHE_TTL_MS = 60 * ONE_MINUTE_MS;
const MAX_CACHE_ENTRIES = 500;

interface CacheEntry {
    expiresAt: number;
    response: Promise<unknown>;
}

const responseCache = new Map<string, CacheEntry>();

function getCacheTtlMs(url: string) {
    if (url.startsWith("/authentication")) return 0;
    if (url.endsWith("/images") || url.endsWith("/watch/providers"))
        return STATIC_CACHE_TTL_MS;
    return DEFAULT_CACHE_TTL_MS;
}

const sendRequest = tmdbRequest.request.bind(tmdbRequest);

tmdbRequest.request = ((requestConfig: Parameters<typeof sendRequest>[0]) => {
    const ttlMs = getCacheTtlMs(requestConfig.url ?? "");
    if (requestConfig.method !== "GET" || !ttlMs) return sendRequest(requestConfig);

    const cacheKey = `${requestConfig.url}?${JSON.stringify(requestConfig.params ?? {})}`;
    const cachedEntry = responseCache.get(cacheKey);
    if (cachedEntry && cachedEntry.expiresAt > Date.now())
        return cachedEntry.response;

    if (responseCache.size >= MAX_CACHE_ENTRIES) {
        const oldestKey = responseCache.keys().next().value as string;
        responseCache.delete(oldestKey);
    }

    const response = sendRequest(requestConfig);
    responseCache.set(cacheKey, { expiresAt: Date.now() + ttlMs, response });
    response.catch(() => responseCache.delete(cacheKey));
    return response;
}) as typeof tmdbRequest.request;

// https://developer.themoviedb.org/reference/movie-now-playing-list

export function movieListNowPlaying({
    language = "en-US",
    page = 1,
    region = "",
}: MovieListsParams) {
    return tmdbRequest.request<MovieListsResponse>({
        url: "/movie/now_playing",
        method: "GET",
        params: {
            language: language,
            page: page,
            region: region,
        },
    });
}

export function movieListPopular({
    language = "en-US",
    page = 1,
    region = "",
}: MovieListsParams) {
    return tmdbRequest.request<MovieListsResponse>({
        url: "/movie/popular",
        method: "GET",
        params: {
            language: language,
            page: page,
            region: region,
        },
    });
}

export function movieListTopRated({
    language = "en-US",
    page = 1,
    region = "",
}: MovieListsParams) {
    return tmdbRequest.request<MovieListsResponse>({
        url: "/movie/top_rated",
        method: "GET",
        params: {
            language: language,
            page: page,
            region: region,
        },
    });
}

export function movieListUpcoming({
    language = "en-US",
    page = 1,
    region = "",
}: MovieListsParams) {
    return tmdbRequest.request<MovieListsResponse>({
        url: "/movie/upcoming",
        method: "GET",
        params: {
            language: language,
            page: page,
            region: region,
        },
    });
}

export function movieImages(movieId: number, imageLanguage: string = "en-US") {
    return tmdbRequest.request<TmdbImagesResult>({
        url: `/movie/${movieId}/images`,
        method: "GET",
        params: {
            include_image_language: imageLanguage,
        },
    });
}

export function seriesImages(
    seriesId: number,
    imageLanguage: string = "en-US",
) {
    return tmdbRequest.request<TmdbImagesResult>({
        url: `/tv/${seriesId}/images`,
        method: "GET",
        params: {
            include_image_language: imageLanguage,
        },
    });
}

export function watchProviders(type: "movie" | "series", id: number) {
    return tmdbRequest.request<TmdbWatchProvidersResult>({
        url: `/${type === "movie" ? "movie" : "tv"}/${id}/watch/providers`,
        method: "GET",
    });
}

export function movieDetails(movieId: number) {
    return tmdbRequest.request<TmdbMovieDetails>({
        url: `/movie/${movieId}`,
        method: "GET",
    });
}

export function seriesDetails(seriesId: number) {
    return tmdbRequest.request<TmdbSeriesDetails>({
        url: `/tv/${seriesId}`,
        method: "GET",
    });
}

export function movieDiscover(params: DiscoverMovieParams) {
    return tmdbRequest.request<MovieDiscover>({
        url: "/discover/movie",
        method: "GET",
        params: params,
    });
}

export function seriesDiscover(params: DiscoverTvParams) {
    return tmdbRequest.request<SeriesDiscover>({
        url: "/discover/tv",
        method: "GET",
        params: params,
    });
}

export function authentication() {
    return tmdbRequest.request<AuthenticationResponse>({
        url: "/authentication",
        method: "GET",
    });
}
