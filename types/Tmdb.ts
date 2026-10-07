export interface TmdbResult {
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
}

export interface MovieListsParams {
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
  results: TmdbResult[]
  total_pages: number
  total_results: number
}

export interface TmdbImage {
    aspect_ratio: number;
    height:       number;
    iso_639_1:    null | string;
    file_path:    string;
    vote_average: number;
    vote_count:   number;
    width:        number;
}

export interface TmdbImagesResult {
    backdrops: TmdbImage[];
    id:        number;
    logos:     TmdbImage[];
    posters:   TmdbImage[];
}

export interface AuthenticationResponse {
    success: boolean;
    message?: string;
}