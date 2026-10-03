import React from "react";

import CircleButton from "@src/components/CircleButton/CircleButton";
import CardRating from "@src/components/CardRating/CardRating";

import "@src/components/CardHero/CardHero.css"

import { card } from "@src/assets";

interface CardHeroProps {}

function CardHero({}: CardHeroProps) {

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
                            <div className="rating">
                                <CardRating value={1} style={{height: 18}}/>
                            </div>
                            <div className="description">
                                After finding themselves ensnared in a death
                                trap, seven disillusioned castoffs must embark
                                on a dangerous mission that will force them to
                                confront the darkest corners of their pasts.
                            </div>
                            <div className="buttons">
                                <CircleButton Action="Play" Icon={card.play} OnClick={() => {}}/>
                                <CircleButton Action="Watch Later" Icon={card.watchLater} OnClick={() => {}} />
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
