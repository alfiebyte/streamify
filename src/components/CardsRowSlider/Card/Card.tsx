import CircleButton from "src/components/CircleButton/CircleButton";
import CardRating from "src/components/CardRating/CardRating";

import { useWatchModal } from "src/context/WatchModalContext";
import { useAddModal } from "src/context/AddModalContext";

import type { CardInterface } from "types/Card"

import { card } from "src/assets";

import "src/components/CardsRowSlider/Card/Card.scss";

function formatRunTime(runTime: number) {
    if (runTime <= 0) return "N/A";

    const hours = Math.floor(runTime / 60);
    const minutes = runTime % 60;

    if (hours && minutes) return `${hours}h ${minutes}m`;
    if (hours) return `${hours}h`;
    return `${minutes}m`;
}

export type CardProps = CardInterface

function Card({
    id,
    type,
    title,
    thumbnail,
    rating,
    year,
    runTime,
    description,
    lastRunTime,
}: CardProps) {
    const { openWatch } = useWatchModal();
    const { openAdd } = useAddModal();

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
                                        width: `${runTime > 0 ? ((lastRunTime ?? 0) / runTime) * 100 : 0}%`,
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
                        <CircleButton
                            Action="Watch"
                            Icon={card.play}
                            OnClick={() => openWatch({ id, type, title })}
                        />
                        <CircleButton
                            Action="Add"
                            Icon={card.watchLater}
                            OnClick={() => openAdd({ id, type, title, thumbnail })}
                            Style={{ marginLeft: "auto", marginRight: 0 }}
                        />
                    </div>
                    <div className="extra">
                        {rating > 0 && (
                            <div className="rating">
                                <CardRating value={rating} />
                            </div>
                        )}
                        {year > 0 && <div className="year">{year}</div>}
                        <div className="runTime">{formatRunTime(runTime)}</div>
                    </div>
                    <div className="description">{description}</div>
                </div>
            </div>
        </div>
    );
}

export default Card;
