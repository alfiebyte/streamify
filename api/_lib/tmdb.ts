import axios from "axios";

import type { MovieListsResponse, MovieListsParams, AuthenticationResponse, TmdbImagesResult } from "types/Tmdb"

import type { DiscoverMovieParams, DiscoverTvParams, MovieDiscover, SeriesDiscover } from "types/TmdbDiscover";

export const TMDB_BASE = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

const tmdbRequest = axios.create({
    baseURL: TMDB_BASE,
    headers: { accept: "application/json" },
    timeout: 5000,
});

tmdbRequest.interceptors.request.use((config) => {
    const tmdbToken = process.env.TMDB_ACCESS_TOKEN
    if (!tmdbToken) throw new Error(`TMDB_ACCESS_TOKEN not set`);

    config.headers.set("Authorization", `Bearer ${tmdbToken}`);
    return config;
});

tmdbRequest.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

// https://developer.themoviedb.org/reference/movie-now-playing-list

export function movieListNowPlaying({ language = "en-US", page = 1, region = "" }: MovieListsParams) {
    return tmdbRequest.request<MovieListsResponse>({
        url: "/movie/now_playing",
        method: "GET",
        params: {
            language: language,
            page: page,
            region: region
        },
    })
}


export function movieListPopular({ language = "en-US", page = 1, region = "" }: MovieListsParams) {
    return tmdbRequest.request<MovieListsResponse>({
        url: "/movie/popular",
        method: "GET",
        params: {
            language: language,
            page: page,
            region: region
        },
    })
}

export function movieListTopRated({ language = "en-US", page = 1, region = "" }: MovieListsParams) {
    return tmdbRequest.request<MovieListsResponse>({
        url: "/movie/top_rated",
        method: "GET",
        params: {
            language: language,
            page: page,
            region: region
        },
    })
}

export function movieListUpcoming({ language = "en-US", page = 1, region = "" }: MovieListsParams) {
    return tmdbRequest.request<MovieListsResponse>({
        url: "/movie/upcoming",
        method: "GET",
        params: {
            language: language,
            page: page,
            region: region
        },
    })
}

export function movieImages(movieId: number, imageLanguage: string = "en-US") {
    return tmdbRequest.request<TmdbImagesResult>({
        url: `/movie/${movieId}/images`,
        method: "GET",
        params: {
            include_image_language: imageLanguage
        }
    })
}

export function seriesImages(seriesId: number, imageLanguage: string = "en-US") {
    return tmdbRequest.request<TmdbImagesResult>({
        url: `/tv/${seriesId}/images`,
        method: "GET",
        params: {
            include_image_language: imageLanguage
        }
    })
}

export function movieDiscover(params: DiscoverMovieParams) {
    return tmdbRequest.request<MovieDiscover>({
        url: "/discover/movie",
        method: "GET",
        params: params
    })
}

export function seriesDiscover(params: DiscoverTvParams) {
    return tmdbRequest.request<SeriesDiscover>({
        url: "/discover/tv",
        method: "GET",
        params: params
    })
}

export function authentication() {
    return tmdbRequest.request<AuthenticationResponse>({
        url: "/authentication",
        method: "GET"
    })
}