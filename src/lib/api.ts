import axios from "axios";

import type { CardType } from "types/Card";
import type { PageResult } from "types/Api";
import type { TitleDetailsResponse, WatchProvidersResponse } from "types/Tmdb";
import type { DiscoverMovieParams, DiscoverTvParams } from "types/TmdbDiscover";

const httpRequest = axios.create({
    baseURL: "/api",
    headers: { accept: "application/json" },
    timeout: 10000,
});

export async function nowPlaying(page: number) {
    const response = await httpRequest.get<PageResult>("/nowPlaying", {
        params: { page },
    });
    return response.data;
}

export async function discover(type: "movie", params?: DiscoverMovieParams): Promise<PageResult>;
export async function discover(type: "series", params?: DiscoverTvParams): Promise<PageResult>;
export async function discover(
    type: "movie" | "series",
    params: DiscoverMovieParams | DiscoverTvParams = {},
) {
    const response = await httpRequest.get<PageResult>(`/discover/${type}`, {
        params,
    });
    return response.data;
}

export async function watchProviders(type: CardType, id: number, region: string) {
    const response = await httpRequest.get<WatchProvidersResponse>(
        "/watchProviders",
        { params: { type, id, region } },
    );
    return response.data;
}

export async function details(type: CardType, id: number) {
    const response = await httpRequest.get<TitleDetailsResponse>("/details", {
        params: { type, id },
    });
    return response.data;
}
