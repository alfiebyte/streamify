import { card } from "@src/assets";
import type React from "react";

interface CardRatingProps {
    value: number;
    style?: React.CSSProperties;
}

import "@src/components/CardRating/CardRating.css"

function CardRating({ value, style }: CardRatingProps) {
    const max = 10;
    const stars = 5;
    const scaled = Math.min(Math.max((value / max) * stars, 0), stars);
    const rounded = Math.round(scaled * 2) / 2;

    return (
        <div role="img" className="stars" style={style}>
            {Array.from({ length: stars }, (_, i) => {
                const starSrc =
                    rounded >= i + 1
                        ? card.starFilled
                        : rounded >= i + 0.5
                          ? card.starHalf
                          : card.star;

                return (
                    <img
                        key={i}
                        src={starSrc}
                        className="star"
                        loading="lazy"
                    />
                );
            })}
        </div>
    );
}

export default CardRating;
