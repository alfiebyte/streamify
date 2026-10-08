import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

import AddModal from "src/components/AddModal/AddModal";

import type { CardType } from "types/Card";

export interface AddTarget {
    id: number;
    type: CardType;
    title: string;
    thumbnail: string;
}

interface AddModalContextValue {
    openAdd: (target: AddTarget) => void;
    historyVersion: number;
    markHistoryChanged: () => void;
}

const AddModalContext = createContext<AddModalContextValue | undefined>(
    undefined,
);

export function AddModalProvider({ children }: { children: React.ReactNode }) {
    const [target, setTarget] = useState<AddTarget | null>(null);

    const [historyVersion, setHistoryVersion] = useState(0);

    const close = useCallback(() => setTarget(null), []);
    const markHistoryChanged = useCallback(
        () => setHistoryVersion((version) => version + 1),
        [],
    );

    return (
        <AddModalContext.Provider
            value={{ openAdd: setTarget, historyVersion, markHistoryChanged }}
        >
            {children}
            {target && <AddModal target={target} onClose={close} />}
        </AddModalContext.Provider>
    );
}

export function useAddModal() {
    const context = useContext(AddModalContext);
    if (!context)
        throw new Error("useAddModal must be used within AddModalProvider");
    return context;
}
