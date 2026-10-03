import React from "react";

import "@src/pages/Home/Home.Page.css"

import CardHero from "@src/components/CardHero/CardHero";

import CardsRowSlider from "@src/components/CardsRowSlider/CardsRowSlider";
import { card } from "@src/assets";

function Home() {
    return (
        <div className="homeEntry">
            <CardHero />
            <div className="sliders">
                <CardsRowSlider Title="Continue Watching" Cards={[{ title: "title", thumbnail: card.thumbnailPlaceholder, rating: 5, year: 2024, runTime: 100, description: "description!" }]} />
            </div>
        </div>
    );
}

export default Home;
