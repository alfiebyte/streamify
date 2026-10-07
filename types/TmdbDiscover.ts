import type { TmdbResult } from "./Tmdb";

export type MonetizationType = "flatrate" | "free" | "ads" | "rent" | "buy";

/** 1 Premiere, 2 Theatrical, 3 Theatrical, 4 Digital, 5 Physical, 6 TV */
export type ReleaseType = 1 | 2 | 3 | 4 | 5 | 6;

/** 0 Returning Series, 1 Planned, 2 In Production, 3 Ended, 4 Cancelled, 5 Pilot */
export type TvStatus = 0 | 1 | 2 | 3 | 4 | 5;

/** 0 Documentary, 1 News, 2 Miniseries, 3 Reality, 4 Scripted, 5 Talk Show, 6 Video */
export type TvType = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type MovieSortBy =
    | "original_title.asc" | "original_title.desc"
    | "popularity.asc" | "popularity.desc"
    | "revenue.asc" | "revenue.desc"
    | "primary_release_date.asc" | "primary_release_date.desc"
    | "title.asc" | "title.desc"
    | "vote_average.asc" | "vote_average.desc"
    | "vote_count.asc" | "vote_count.desc";

export type TvSortBy =
    | "first_air_date.asc" | "first_air_date.desc"
    | "name.asc" | "name.desc"
    | "original_name.asc" | "original_name.desc"
    | "popularity.asc" | "popularity.desc"
    | "vote_average.asc" | "vote_average.desc"
    | "vote_count.asc" | "vote_count.desc";


export interface DiscoverBaseParams {
    include_adult?: boolean;
    language?: string;
    page?: number;

    "vote_average.gte"?: number;
    "vote_average.lte"?: number;
    "vote_count.gte"?: number;
    "vote_count.lte"?: number;

    "with_runtime.gte"?: number;
    "with_runtime.lte"?: number;

    watch_region?: string;
    with_watch_monetization_types?: MonetizationType | string; // comma = AND, pipe = OR
    with_watch_providers?: string;    // comma = AND, pipe = OR
    without_watch_providers?: string;

    with_companies?: string;
    without_companies?: string;
    with_genres?: string;
    without_genres?: string;
    with_keywords?: string;
    without_keywords?: string;

    with_origin_country?: string;
    with_original_language?: string;
}


export interface DiscoverMovieParams extends DiscoverBaseParams {
    sort_by?: MovieSortBy;
    include_video?: boolean;
    region?: string;


    certification?: string;
    "certification.gte"?: string;
    "certification.lte"?: string;
    certification_country?: string;

    year?: number;
    primary_release_year?: number;
    "primary_release_date.gte"?: string;
    "primary_release_date.lte"?: string;
    "release_date.gte"?: string;
    "release_date.lte"?: string;
    with_release_type?: ReleaseType | string;

    with_cast?: string;
    with_crew?: string;
    with_people?: string;
}


  
export interface MovieDiscover {
    page:          number;
    results:       TmdbResult[];
    total_pages:   number;
    total_results: number;
}

export interface SeriesDiscover {
    page:          number;
    results:       TmdbResult[];
    total_pages:   number;
    total_results: number;
}

export type OriginalLanguage = "en" | "es" | "nl" | "ko";

export interface DiscoverTvParams extends DiscoverBaseParams {
    sort_by?: TvSortBy;
    include_null_first_air_dates?: boolean;
    screened_theatrically?: boolean;
    timezone?: string;


    first_air_date_year?: number;
    "first_air_date.gte"?: string;
    "first_air_date.lte"?: string;
    "air_date.gte"?: string;
    "air_date.lte"?: string;

    with_networks?: number;
    with_status?: TvStatus | string;
    with_type?: TvType | string;
}