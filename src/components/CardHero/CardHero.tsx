import React, { useEffect, useState } from "react";

import CircleButton from "src/components/CircleButton/CircleButton";
import CardRating from "src/components/CardRating/CardRating";

import "src/components/CardHero/CardHero.css"

import { card } from "src/assets";
import { useWatchModal } from "src/context/WatchModalContext";
import { useAddModal } from "src/context/AddModalContext";
import { discover } from "src/lib/api";

import type { CardInterface } from "types/Card";

interface CardHeroProps {}

const HERO_MAX_PAGE = 2;

async function fetchRandomHero(): Promise<CardInterface | null> {
    const isMovie = Math.random() < 0.5;
    const params = {
        include_adult: false,
        language: "en-US",
        sort_by: "vote_count.desc" as const,
        "vote_count.gte": isMovie ? 10000 : 3000,
        "vote_average.gte": 7.5,
        page: Math.floor(Math.random() * HERO_MAX_PAGE) + 1,
    };
    const { items } = isMovie
        ? await discover("movie", params)
        : await discover("series", params);
    const candidates = items.filter((item) => !item.thumbnail.endsWith("null"));
    if (!candidates.length) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
}

function CardHero({}: CardHeroProps) {

    const { openWatch } = useWatchModal();
    const { openAdd } = useAddModal();
    const [hero, setHero] = useState<CardInterface | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetchRandomHero()
            .then((item) => {
                if (!cancelled) setHero(item);
            })
            .catch(console.error);
        return () => {
            cancelled = true;
        };
    }, []);

    if (!hero) return <section className="hero" />;

    const heroTarget = { id: hero.id, type: hero.type, title: hero.title };

    const extraItems = [
        hero.type === "movie" ? "Movie" : "Series",
        hero.year,
        ...(hero.genres?.slice(0, 3) ?? []),
    ];

    return (
        <section className="hero">
            <div className="main">
                <div className="backdrop-container">
                    <img
                        src={hero.thumbnail.replace("/w780", "/original")}
                        alt=""
                        className="backdrop-image"
                    />
                    <div className="information">
                        <div className="left">
                            <h1 className="title">{hero.title}</h1>
                            <div className="extra">
                                {extraItems.map((extraItem) => (
                                    <span key={extraItem} className="text">
                                        {extraItem}
                                    </span>
                                ))}
                            </div>
                            <div className="rating">
                                <CardRating value={hero.rating} style={{height: 18}}/>
                            </div>
                            <div className="description">
                                {hero.description}
                            </div>
                            <div className="buttons">
                                <CircleButton
                                    Action="Watch"
                                    Icon={card.play}
                                    OnClick={() => openWatch(heroTarget)}
                                />
                                <CircleButton
                                    Action="Add"
                                    Icon={card.watchLater}
                                    OnClick={() => openAdd({ id: hero.id, type: hero.type, title: hero.title, thumbnail: hero.thumbnail })}
                                />
                            </div>
                        </div>
                        <div className="more"></div>
                    </div>
                    <div className="fade"></div>
                    <div className="fadeRight"></div>
                </div>
            </div>
        </section>
    );
}

export default CardHero;
