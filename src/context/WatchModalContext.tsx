import React, { createContext, useContext, useEffect, useState } from "react";

import WatchModal from "src/components/WatchModal/WatchModal";

import type { CardType } from "types/Card";

export interface WatchTarget {
    id: number;
    type: CardType;
    title: string;
}

interface WatchModalContextValue {
    openWatch: (target: WatchTarget) => void;
}

const WatchModalContext = createContext<WatchModalContextValue | undefined>(
    undefined,
);

export function WatchModalProvider({ children }: { children: React.ReactNode }) {
    const [target, setTarget] = useState<WatchTarget | null>(null);

    return (
        <WatchModalContext.Provider value={{ openWatch: setTarget }}>
            {children}
            {target && (
                <WatchModal target={target} onClose={() => setTarget(null)} />
            )}
        </WatchModalContext.Provider>
    );
}

export function useWatchModal() {
    const context = useContext(WatchModalContext);
    if (!context)
        throw new Error("useWatchModal must be used within WatchModalProvider");
    return context;
}
