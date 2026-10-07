import "src/components/CardsRowSlider/CardsRowSlider.css";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CardProps } from "./Card/Card";

import Card from "src/components/CardsRowSlider/Card/Card";

import { row } from "src/assets";
import type { CardInterface } from "types/Card";
import type { AxiosResponse } from "axios";

export interface PageResult {
    page: number;
    items: CardInterface[];
    totalPages: number;
}

interface CardsRowSliderProps {
    Title: string;
    fetchPage: (page: number) => Promise<AxiosResponse<PageResult>>;
}

function CardsRowSlider({ Title, fetchPage }: CardsRowSliderProps) {
    const [cards, setCards] = useState<CardProps[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [sliderPosition, setSliderPosition] = useState<number>(0);

    const cardsRef = useRef<HTMLDivElement>(null);

    const pageRef = useRef<number>(0);
    const loadingRef = useRef<boolean>(false);

    const loadNextPage = useCallback(async () => {
        if (loadingRef.current) return;
        loadingRef.current = true;
        try {
            const response = await fetchPage(pageRef.current + 1);
            pageRef.current = response.data.page;
            setCards((prev) => [...prev, ...response.data.items]);
            setHasMore(response.data.page < response.data.totalPages);
        } catch (err) {
            console.error(err);
        } finally {
            loadingRef.current = false;
        }
    }, [fetchPage]);

    useEffect(() => {
        loadNextPage();
    }, []);

    function getMaxPosition() {
        const element = cardsRef.current;
        if (!element) return 0;
        return Math.max(
            0,
            ((element.scrollWidth - element.clientWidth) /
                element.clientWidth) *
                100,
        );
    }

    function slideLeft() {
        setSliderPosition((prev) => Math.max(0, prev - 100));
    }

    function slideRight() {
        const max = getMaxPosition();
        const atEnd = sliderPosition >= max - 1;

        if (atEnd) {
            if (hasMore) loadNextPage();
            return;
        }

        const next = Math.min(sliderPosition + 100, max);
        setSliderPosition(next);

        if (next >= max - 1) loadNextPage();
    }

    return (
        <div className="row">
            <div className="headerTitle">{Title}</div>
            <div className="slider">
                <div
                    ref={cardsRef}
                    style={{ transform: `translateX(${-sliderPosition}%)` }}
                    className="cards"
                >
                    {cards.map((cardProps, i) => (
                        <Card key={`${cardProps.title}-${i}`} {...cardProps} />
                    ))}
                </div>
                <div onClick={slideLeft} style={{ left: 0 }} className="arrow">
                    <img className="arrowImg" src={row.arrowLeft} />
                </div>
                {hasMore || sliderPosition < getMaxPosition() - 1 ? (
                    <div
                        onClick={slideRight}
                        style={{ right: 0 }}
                        className="arrow"
                    >
                        <img className="arrowImg" src={row.arrowRight} />
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default CardsRowSlider;
