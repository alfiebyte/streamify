import "@src/components/Hero/HeroButton/HeroButton.css";
import type React from "react";

interface HeroButtonProps {
    Action: string;
    Icon: string;
    OnClick: React.MouseEventHandler<HTMLButtonElement>;
}

function HeroButton({ Action, Icon, OnClick }: HeroButtonProps) {
    return (
        <button className="button" onClick={OnClick}>
            <img loading="lazy" src={Icon} alt={Action} className="icon" />
            <div className="label">{Action}</div>
        </button>
    );
}

export default HeroButton;