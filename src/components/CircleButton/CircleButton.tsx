import "@src/components/CircleButton/CircleButton.css";
import type React from "react";

interface CircleButtonProps {
    Action: string;
    Icon: string;
    OnClick?: React.MouseEventHandler<HTMLButtonElement>;
    Style?: React.CSSProperties;
}

function CircleButton({ Action, Icon, OnClick, Style }: CircleButtonProps) {
    return (
        <button className="button" onClick={OnClick} style={Style}>
            <img loading="lazy" src={Icon} alt={Action} className="icon" />
            <div className="label">{Action}</div>
        </button>
    );
}

export default CircleButton;