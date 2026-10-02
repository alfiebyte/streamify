import React from "react";

import HeroButton from "./HeroButton/HeroButton";

import "@src/components/Hero/Hero.css"

import { hero } from "@src/assets";

interface HeroRatingProps {
    value: number;
}

function HeroRating({ value }: HeroRatingProps) {
    const max = 10;
    const stars = 5;
    const scaled = Math.min(Math.max((value / max) * stars, 0), stars);
    const rounded = Math.round(scaled * 2) / 2;

    return (
        <div
            className="rating"
            role="img"
        >
            {Array.from({ length: stars }, (_, i) => {
                const src =
                    rounded >= i + 1
                        ? hero.starFilled
                        : rounded >= i + 0.5
                          ? hero.starHalf
                          : hero.star;

                return (
                    <img
                        key={i}
                        src={src}
                        alt=""
                        className="star"
                        loading="lazy"
                    />
                );
            })}
        </div>
    );
}

interface HeroProps {}

function Hero({}: HeroProps) {

    const extraItems = ["2025", "2h 5m", "Action", "Science Fiction", "Adventure"];

    return (
        <section className="hero">
            <div className="main">
                <div className="backdrop-container">
                    <img
                        src="https://image.tmdb.org/t/p/original/wSdWEc1G3OUWg8HAzNLqOZ9Gd43.jpg"
                        alt=""
                        className="backdrop-image"
                    />
                    <div className="information">
                        <div className="left">
                            <img
                                src="https://image.tmdb.org/t/p/original/jpDCjWduAFkJH9Y1g8sZGaso7eD.png"
                                alt=""
                                className="logo"
                            />
                            <div className="extra">
                                {extraItems.map((extraItem) => (
                                    <span key={extraItem} className="text">
                                        {extraItem}
                                    </span>
                                ))}
                            </div>
                            <HeroRating value={5.5}/>
                            <div className="description">
                                After finding themselves ensnared in a death
                                trap, seven disillusioned castoffs must embark
                                on a dangerous mission that will force them to
                                confront the darkest corners of their pasts.
                            </div>
                            <div className="buttons">
                                <HeroButton Action="Play" Icon={hero.play} OnClick={() => {}}/>
                                <HeroButton Action="Watch Later" Icon={hero.watchLater} OnClick={() => {}} />
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

export default Hero;
