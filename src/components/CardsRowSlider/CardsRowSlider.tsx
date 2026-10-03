import "@src/components/CardsRowSlider/CardsRowSlider.css";
import { useState } from "react";
import type { CardProps } from "./Card/Card";

import Card from "@src/components/CardsRowSlider/Card/Card";

import { row, card } from "@src/assets";

interface CardsRowSliderProps {
    Title: string;
    Cards: CardProps[];
}

function CardsRowSlider({ Title, Cards }: CardsRowSliderProps) {
    const [sliderPosition, setSliderPosition] = useState<number>(0);

    const slideLeft = () => {
        setSliderPosition((prev) => prev - 100);
    };

    const slideRight = () => {
        setSliderPosition((prev) => prev + 100);
    };

    return (
        <div className="row">
            <span className="headerTitle">{Title}</span>
            <div
                className="slider"
                style={{ transform: `translateX(${-sliderPosition}%)` }}
            >
                <div className="cards">
                    {Cards.map((CardProps) => (
                        <Card {...CardProps} />
                    ))}
                </div>
            </div>
            <div onClick={slideLeft} style={{ left: 0 }} className="arrow">
                <img className="arrowImg" src={row.arrowLeft} />
            </div>
            <div onClick={slideRight} style={{ right: 0 }} className="arrow">
                <img className="arrowImg" src={row.arrowRight} />
            </div>
        </div>
    );
}

export default CardsRowSlider;
