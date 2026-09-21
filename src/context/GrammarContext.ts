import {
    createContext,
    useContext,
} from "react";

import type { GrammarWordRef } from "../types/grammar";


export interface GrammarContextValue {
    words: GrammarWordRef[];
    count: number;

    addWord: (word: GrammarWordRef) => void;
    removeWord: (word: GrammarWordRef) => void;

    isInGrammar: (
        word: GrammarWordRef,
    ) => boolean;

    clearGrammar: () => void;
}


export const GrammarContext =
    createContext<GrammarContextValue | undefined>(
        undefined,
    );


export function useGrammar() {
    const context =
        useContext(GrammarContext);

    if (!context) {
        throw new Error(
            "useGrammar must be used inside GrammarProvider",
        );
    }

    return context;
}