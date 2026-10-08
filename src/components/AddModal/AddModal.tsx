import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { details } from "src/lib/api";
import { useAuth } from "src/context/AuthContext";
import { useAddModal } from "src/context/AddModalContext";
import {
    getWatchEntry,
    getWatchedEpisodes,
    removeWatchHistory,
    saveWatchProgress,
    setEpisodeWatched,
} from "src/lib/watchHistory";
import type { AddTarget } from "src/context/AddModalContext";
import type { TitleDetailsResponse } from "types/Tmdb";

import "src/components/WatchModal/WatchModal.css";
import "src/components/AddModal/AddModal.css";

interface AddModalProps {
    target: AddTarget;
    onClose: () => void;
}

function formatMinutes(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    if (hours && rest) return `${hours}h ${rest}m`;
    if (hours) return `${hours}h`;
    return `${rest}m`;
}

function episodeKey(season: number, episode: number) {
    return `${season}:${episode}`;
}

interface TrackerProps {
    target: AddTarget;
    userId: string;
    info: TitleDetailsResponse;
    onRemoved: () => void;
}

function MovieTracker({ target, userId, info, onRemoved }: TrackerProps) {
    const runtime = info.runtime ?? 0;
    const [minutes, setMinutes] = useState(0);
    const [saved, setSaved] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { markHistoryChanged } = useAddModal();

    useEffect(() => {
        getWatchEntry("movie", target.id)
            .then((entry) => {
                if (!entry) return;
                setSaved(true);
                setMinutes(
                    Math.min(runtime, Math.round(entry.progress_seconds / 60)),
                );
            })
            .catch(console.error);
    }, [target.id, runtime]);

    const save = async () => {
        setBusy(true);
        setError(null);
        try {
            await saveWatchProgress(userId, {
                tmdb_id: target.id,
                type: "movie",
                title: target.title,
                thumbnail: target.thumbnail,
                progress_seconds: minutes * 60,
                runtime_minutes: runtime,
            });
            setSaved(true);
            markHistoryChanged();
        } catch (saveError) {
            console.error(saveError);
            setError("Couldn't save your progress.");
        } finally {
            setBusy(false);
        }
    };

    const remove = async () => {
        setBusy(true);
        try {
            await removeWatchHistory("movie", target.id);
            markHistoryChanged();
            onRemoved();
        } catch (error) {
            console.error(error);
            setBusy(false);
        }
    };

    if (!runtime) return <div className="message">Runtime unavailable.</div>;

    return (
        <div className="tracker">
            <div className="progress-label">
                {formatMinutes(minutes)} / {formatMinutes(runtime)}
            </div>
            <input
                type="range"
                min={0}
                max={runtime}
                value={minutes}
                onChange={(event) => setMinutes(parseInt(event.target.value))}
            />
            <div className="actions">
                <button className="primary" onClick={save} disabled={busy}>
                    {saved ? "Update progress" : "Add"}
                </button>
                {saved && (
                    <button onClick={remove} disabled={busy}>
                        Remove
                    </button>
                )}
            </div>
            {error && <div className="message">{error}</div>}
        </div>
    );
}

function SeriesTracker({ target, userId, info, onRemoved }: TrackerProps) {
    const seasons = info.seasons ?? [];
    const [watched, setWatched] = useState<Set<string>>(new Set());
    const [saved, setSaved] = useState(false);
    const { markHistoryChanged } = useAddModal();

    useEffect(() => {
        getWatchEntry("series", target.id)
            .then((entry) => setSaved(!!entry))
            .catch(console.error);
        getWatchedEpisodes(target.id).then(setWatched).catch(console.error);
    }, [target.id]);

    const ensureSaved = async () => {
        if (saved) return;
        await saveWatchProgress(userId, {
            tmdb_id: target.id,
            type: "series",
            title: target.title,
            thumbnail: target.thumbnail,
            progress_seconds: 0,
            runtime_minutes: 0,
        });
        setSaved(true);
        markHistoryChanged();
    };

    const toggle = async (
        episodes: { season: number; episode: number }[],
        value: boolean,
    ) => {
        try {
            await ensureSaved();
            await setEpisodeWatched(userId, target.id, episodes, value);
            setWatched((previous) => {
                const next = new Set(previous);
                for (const { season, episode } of episodes) {
                    const key = episodeKey(season, episode);
                    if (value) {
                        next.add(key);
                    } else {
                        next.delete(key);
                    }
                }
                return next;
            });
        } catch (error) {
            console.error(error);
        }
    };

    const remove = async () => {
        try {
            await removeWatchHistory("series", target.id);
            markHistoryChanged();
            onRemoved();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="tracker">
            {seasons.map((season) => {
                const episodes = Array.from(
                    { length: season.episodeCount },
                    (_, index) => ({
                        season: season.number,
                        episode: index + 1,
                    }),
                );
                const allWatched = episodes.every((item) =>
                    watched.has(episodeKey(item.season, item.episode)),
                );
                return (
                    <div key={season.number} className="season">
                        <label className="season-header">
                            <input
                                type="checkbox"
                                checked={allWatched}
                                onChange={() => toggle(episodes, !allWatched)}
                            />
                            {season.name}
                        </label>
                        <div className="episodes">
                            {episodes.map((item) => (
                                <label key={item.episode} className="episode">
                                    <input
                                        type="checkbox"
                                        checked={watched.has(
                                            episodeKey(
                                                item.season,
                                                item.episode,
                                            ),
                                        )}
                                        onChange={(event) =>
                                            toggle([item], event.target.checked)
                                        }
                                    />
                                    {item.episode}
                                </label>
                            ))}
                        </div>
                    </div>
                );
            })}
            {saved && (
                <div className="actions">
                    <button onClick={remove}>Remove</button>
                </div>
            )}
        </div>
    );
}

function AddModal({ target, onClose }: AddModalProps) {
    const { session, loading, signInWithGoogle } = useAuth();
    const [info, setInfo] = useState<TitleDetailsResponse | null>(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        let cancelled = false;
        details(target.type, target.id)
            .then((result) => !cancelled && setInfo(result))
            .catch(() => !cancelled && setFailed(true));
        return () => {
            cancelled = true;
        };
    }, [target]);

    const Tracker = target.type === "movie" ? MovieTracker : SeriesTracker;

    return createPortal(
        <div className="watch-modal add-modal" onClick={onClose}>
            <div
                className="container"
                role="dialog"
                onClick={(event) => event.stopPropagation()}
            >
                <button className="close" onClick={onClose}>
                    x
                </button>
                <div className="title">{target.title}</div>
                <div className="subtitle">
                    {target.type === "movie"
                        ? "Save your progress"
                        : "Mark watched episodes"}
                </div>
                {!loading && !session && (
                    <div className="tracker">
                        <div className="message">
                            Sign in to save your progress.
                        </div>
                        <div className="actions">
                            <button
                                className="primary"
                                onClick={signInWithGoogle}
                            >
                                Sign in with Google
                            </button>
                        </div>
                    </div>
                )}
                {session && failed && (
                    <div className="message">Couldn't load details.</div>
                )}
                {session && !info && !failed && (
                    <div className="message">Loading...</div>
                )}
                {session && info && (
                    <Tracker
                        target={target}
                        userId={session.user.id}
                        info={info}
                        onRemoved={onClose}
                    />
                )}
            </div>
        </div>,
        document.body,
    );
}

export default AddModal;
