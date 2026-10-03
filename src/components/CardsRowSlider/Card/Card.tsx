import CircleButton from "@src/components/CircleButton/CircleButton";
import CardRating from "@src/components/CardRating/CardRating";

import { card } from "@src/assets";

import "@src/components/CardsRowSlider/Card/Card.scss";

function formatRunTime(runTime: number) {
    if (runTime <= 0) return "N/A";

    const hours = Math.floor(runTime / 60);
    const minutes = runTime % 60;

    if (hours && minutes) return `${hours}h ${minutes}m`;
    if (hours) return `${hours}h`;
    return `${minutes}m`;
}

export interface CardProps {
    title: string;
    thumbnail: string;
    rating: number;
    year: number;
    runTime: number;
    description: string;
    lastRunTime?: number;
}

function Card({
    title,
    thumbnail,
    rating,
    year,
    runTime,
    description,
    lastRunTime,
}: CardProps) {
    return (
        <div className="card">
            <div className="children">
                <div className="card-container">
                    <img src={thumbnail} alt="" className="thumbnail" />
                    <div className="info">
                        <div className="info-container">
                            <div className="runTime">
                                <div
                                    style={{
                                        width: `${((lastRunTime ?? 0) / runTime) * 100}%`,
                                    }}
                                    className="current"
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="dropdrown-details">
                    <div className="title">{title}</div>
                    <div className="buttons">
                        <CircleButton Action="Play" Icon={card.play} />
                        <CircleButton
                            Action="Watch Later"
                            Icon={card.watchLater}
                            Style={{ marginLeft: "auto", marginRight: 0 }}
                        />
                    </div>
                    <div className="extra">
                        <div className="rating">
                            <CardRating value={rating} />
                        </div>
                        <div className="year">{year}</div>
                        <div className="runTime">{formatRunTime(runTime)}</div>
                    </div>
                    <div className="description">{description}</div>
                </div>
            </div>
        </div>
    );
}

export default Card;
