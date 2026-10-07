import React, { useEffect, useState } from "react";

import "src/pages/Home/Home.Page.css";

import CardHero from "src/components/CardHero/CardHero";

import CardsRowSlider from "src/components/CardsRowSlider/CardsRowSlider";
import { card } from "src/assets";
import axios from "axios";

import type { PageResult } from "types/Api";
import type { CardInterface } from "types/Card";
import type { DiscoverMovieParams, DiscoverTvParams } from "types/TmdbDiscover";

const isoDate = (d: Date) => d.toISOString().slice(0, 10);

function Home() {
    function fetchNowPlaying(page: number) {
        return axios.request<PageResult>({
            url: "api/nowPlaying",
            method: "GET",
            params: {
                page: page,
            },
        });
    }

    function comingSoonMovies(page: number) {
        const from = new Date();
        const to = new Date();
        to.setMonth(to.getMonth() + 2);

        const params: DiscoverMovieParams = {
            include_adult: false,
            include_video: false,
            language: "en-US",
            "primary_release_date.gte": isoDate(from),
            "primary_release_date.lte": isoDate(to),
            sort_by: "popularity.desc",
            "with_runtime.gte": 75,
            page,
        };
        return axios.request<PageResult>({
            url: "api/discover/movie",
            method: "GET",
            params: params,
        });
    }

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
        return axios.request<PageResult>({
            url: "api/discover/series",
            method: "GET",
            params: params,
        });
    }

    return (
        <div className="homeEntry">
            <CardHero />
            <div className="sliders">
                <CardsRowSlider
                    Title="Now Playing In Cinemas"
                    fetchPage={fetchNowPlaying}
                />
                <CardsRowSlider
                    Title="Coming Soon Series"
                    fetchPage={comingSoonSeries}
                />
                <CardsRowSlider
                    Title="Coming Soon Movies"
                    fetchPage={comingSoonMovies}
                />
            </div>
        </div>
    );
}

export default Home;
