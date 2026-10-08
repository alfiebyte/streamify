import { supabase } from "src/lib/supabase";

import { card } from "src/assets";

import type { PageResult } from "types/Api";
import type { CardType } from "types/Card";

export interface WatchHistoryEntry {
    tmdb_id: number;
    type: CardType;
    title: string;
    thumbnail: string | null;
    progress_seconds: number;
    runtime_minutes: number;
    updated_at: string;
}

export async function saveWatchProgress(
    userId: string,
    entry: Pick<WatchHistoryEntry, "tmdb_id" | "type" | "title" | "thumbnail" | "progress_seconds" | "runtime_minutes">,
) {
    const { error } = await supabase
        .from("watch_history")
        .upsert(
            { user_id: userId, ...entry, updated_at: new Date().toISOString() },
            { onConflict: "user_id,type,tmdb_id" },
        );
    if (error) throw error;
}

const HISTORY_PAGE_SIZE = 20;

export async function getWatchHistory(page: number): Promise<PageResult> {
    const from = (page - 1) * HISTORY_PAGE_SIZE;
    const { data, error, count } = await supabase
        .from("watch_history")
        .select("tmdb_id, type, title, thumbnail, progress_seconds, runtime_minutes", { count: "exact" })
        .order("updated_at", { ascending: false })
        .range(from, from + HISTORY_PAGE_SIZE - 1)
        .overrideTypes<Omit<WatchHistoryEntry, "updated_at">[]>();
    if (error) throw error;

    return {
        success: true,
        page,
        totalPages: Math.ceil((count ?? 0) / HISTORY_PAGE_SIZE),
        items: data.map((entry) => ({
            id: entry.tmdb_id,
            type: entry.type,
            title: entry.title,
            thumbnail: entry.thumbnail ?? card.thumbnailPlaceholder,
            description: "",
            rating: 0,
            year: 0,
            runTime: entry.runtime_minutes,
            lastRunTime: Math.round(entry.progress_seconds / 60),
        })),
    };
}

export async function removeWatchHistory(type: CardType, tmdbId: number) {
    const { error } = await supabase
        .from("watch_history")
        .delete()
        .eq("type", type)
        .eq("tmdb_id", tmdbId);
    if (error) throw error;

    if (type === "series") {
        const { error: episodesError } = await supabase
            .from("watched_episodes")
            .delete()
            .eq("tmdb_id", tmdbId);
        if (episodesError) throw episodesError;
    }
}

export async function getWatchEntry(type: CardType, tmdbId: number) {
    const { data, error } = await supabase
        .from("watch_history")
        .select("tmdb_id, type, title, thumbnail, progress_seconds, updated_at")
        .eq("type", type)
        .eq("tmdb_id", tmdbId)
        .maybeSingle<WatchHistoryEntry>();
    if (error) throw error;
    return data;
}

export async function getWatchedEpisodes(tmdbId: number) {
    const { data, error } = await supabase
        .from("watched_episodes")
        .select("season, episode")
        .eq("tmdb_id", tmdbId);
    if (error) throw error;
    return new Set(data.map(({ season, episode }) => `${season}:${episode}`));
}

export async function setEpisodeWatched(
    userId: string,
    tmdbId: number,
    episodes: { season: number; episode: number }[],
    watched: boolean,
) {
    if (watched) {
        const { error } = await supabase
            .from("watched_episodes")
            .upsert(
                episodes.map((episode) => ({ user_id: userId, tmdb_id: tmdbId, ...episode })),
                { onConflict: "user_id,tmdb_id,season,episode", ignoreDuplicates: true },
            );
        if (error) throw error;
        return;
    }
    for (const { season, episode } of episodes) {
        const { error } = await supabase
            .from("watched_episodes")
            .delete()
            .eq("tmdb_id", tmdbId)
            .eq("season", season)
            .eq("episode", episode);
        if (error) throw error;
    }
}
