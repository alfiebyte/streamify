import React, { useEffect, useState } from "react";

import "src/pages/Home/Home.Page.css";

import CardHero from "src/components/CardHero/CardHero";

import CardsRowSlider from "src/components/CardsRowSlider/CardsRowSlider";
import { card } from "src/assets";
import { discover, nowPlaying } from "src/lib/api";
import { useAuth } from "src/context/AuthContext";
import { useAddModal } from "src/context/AddModalContext";
import { getWatchHistory } from "src/lib/watchHistory";

import type { PageResult } from "types/Api";
import type { CardInterface } from "types/Card";
import type { DiscoverMovieParams, DiscoverTvParams } from "types/TmdbDiscover";

const isoDate = (d: Date) => d.toISOString().slice(0, 10);

function Home() {
    const { session } = useAuth();
    const { historyVersion } = useAddModal();

    function comingSoonSeries(page: number) {
        const from = new Date();
        const to = new Date();
        to.setMonth(to.getMonth() + 2);

        const params: DiscoverTvParams = {
            include_adult: false,
            language: "en-US",
            "first_air_date.gte": isoDate(from),
            "first_air_date.lte": isoDate(to),
            sort_by: "popularity.desc",
            page,
        };
        return discover("series", params);
    }

    function discoverMovies(params: DiscoverMovieParams) {
        return (page: number) =>
            discover("movie", {
                include_adult: false,
                language: "en-US",
                ...params,
                page,
            });
    }

    function discoverSeries(params: DiscoverTvParams) {
        return (page: number) =>
            discover("series", {
                include_adult: false,
                language: "en-US",
                ...params,
                page,
            });
    }

    const sliders: {
        title: string;
        fetchPage: (page: number) => Promise<PageResult>;
        refreshKey?: number;
    }[] = [
        { title: "Recently Watched", fetchPage: getWatchHistory, refreshKey: historyVersion },
        { title: "Now Playing In Cinemas", fetchPage: nowPlaying },
        { title: "Top Rated Movies", fetchPage: discoverMovies({ sort_by: "vote_average.desc", "vote_count.gte": 5000 }) },
        { title: "Coming Soon Series", fetchPage: comingSoonSeries },
        { title: "Acclaimed Series", fetchPage: discoverSeries({ sort_by: "vote_average.desc", "vote_count.gte": 1500 }) },
    ];

    return (
        <div className="homeEntry">
            <CardHero />
            <div className="sliders">
                {sliders.map(({ title, fetchPage, refreshKey }) => (
                    <CardsRowSlider
                        key={title}
                        Title={title}
                        fetchPage={fetchPage}
                        refreshKey={refreshKey}
                    />
                ))}
            </div>
        </div>
    );
}

export default Home;
