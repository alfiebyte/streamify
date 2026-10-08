import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { watchProviders } from "src/lib/api";
import type { WatchTarget } from "src/context/WatchModalContext";
import type { WatchProviderLogo, WatchProvidersResponse } from "types/Tmdb";

import "src/components/WatchModal/WatchModal.css";

interface WatchModalProps {
    target: WatchTarget;
    onClose: () => void;
}

function getRegion() {
    return navigator.language.split("-")[1]?.toUpperCase() ?? "US";
}

interface SectionProps {
    label: string;
    providers: WatchProviderLogo[];
    link: string;
}

function Section({ label, providers, link }: SectionProps) {
    if (!providers.length) return null;
    return (
        <div className="section">
            <div className="label">{label}</div>
            <div className="providers">
                {providers.map((provider) => (
                    <a
                        key={provider.id}
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        title={provider.name}
                    >
                        <img src={provider.logo} alt={provider.name} />
                    </a>
                ))}
            </div>
        </div>
    );
}

function WatchModal({ target, onClose }: WatchModalProps) {
    const [data, setData] = useState<WatchProvidersResponse | null>(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        let cancelled = false;
        watchProviders(target.type, target.id, getRegion())
            .then((result) => !cancelled && setData(result))
            .catch(() => !cancelled && setFailed(true));
        return () => {
            cancelled = true;
        };
    }, [target]);

    const empty =
        data && !data.flatrate.length && !data.rent.length && !data.buy.length;

    return createPortal(
        <div className="watch-modal" onClick={onClose}>
            <div
                className="container"
                onClick={(event) => event.stopPropagation()}
            >
                <button className="close" onClick={onClose}>
                    x
                </button>
                <div className="title">{target.title}</div>
                <div className="subtitle">Where to watch</div>
                {failed && <div className="message">Couldn't load providers.</div>}
                {!data && !failed && <div className="message">Loading…</div>}
                {empty && (
                    <div className="message">
                        Not available to stream in your region.
                    </div>
                )}
                {data && (
                    <>
                        <Section label="Stream" providers={data.flatrate} link={data.link} />
                        <Section label="Rent" providers={data.rent} link={data.link} />
                        <Section label="Buy" providers={data.buy} link={data.link} />
                    </>
                )}
            </div>
        </div>,
        document.body,
    );
}

export default WatchModal;
