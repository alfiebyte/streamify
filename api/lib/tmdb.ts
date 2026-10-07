import axios from "axios";

export const TMDB_BASE = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

const tmdbRequest = axios.create({
    baseURL: TMDB_BASE,
    headers: { accept: "application/json" },
    timeout: 10000,
});

tmdbRequest.interceptors.request.use((config) => {
    const tmdbToken = process.env.TMDB_ACCESS_TOKEN
    console.log(process.env)
    if (!tmdbToken) throw new Error(`TMDB_ACCESS_TOKEN not set`);

    config.headers.set("Authorization", `Bearer ${tmdbToken}`);
    return config;
});

tmdbRequest.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

// https://developer.themoviedb.org/reference/movie-now-playing-list
interface MovieListsParams {
    language?: string;
    page?: number;
    region?: string; // ISO-3166-1 code??
}

export interface MovieListsResponse {
  dates: {
    maximum: string
    minimum: string
  }
  page: number
  results: Array<{
    adult: boolean
    backdrop_path: string
    genre_ids: Array<number>
    id: number
    original_language: string
    original_title: string
    overview: string
    popularity: number
    poster_path: string
    release_date: string
    title: string
    video: boolean
    vote_average: number
    vote_count: number
  }>
  total_pages: number
  total_results: number
}

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

interface AuthenticationResponse {
    success: boolean;
    message?: string;
}

export function authentication() {
    return tmdbRequest.request<AuthenticationResponse>({
        url: "/authentication",
        method: "GET"
    })
}