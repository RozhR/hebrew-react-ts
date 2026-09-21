import {
    useEffect,
    useState,
} from "react";

import type { ReactNode } from "react";
import type { GrammarWordRef } from "../types/grammar";

import { GrammarContext } from "./GrammarContext";


const STORAGE_KEY = "grammarWords";


function loadGrammarWords(): GrammarWordRef[] {
    try {
        const saved =
            localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            return [];
        }

        const parsed: unknown =
            JSON.parse(saved);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.filter(
            (
                item,
            ): item is GrammarWordRef => {
                if (
                    typeof item !== "object" ||
                    item === null
                ) {
                    return false;
                }

                const word =
                    item as Record<
                        string,
                        unknown
                    >;

                const validCategory =
                    word.category === "verbs" ||
                    word.category === "adjectives" ||
                    word.category === "adverbs";

                return (
                    validCategory &&
                    typeof word.id === "number" &&
                    Number.isInteger(word.id)
                );
            },
        );
    } catch {
        return [];
    }
}


type GrammarProviderProps = {
    children: ReactNode;
};


export function GrammarProvider({
                                    children,
                                }: GrammarProviderProps) {
    const [words, setWords] =
        useState<GrammarWordRef[]>(
            loadGrammarWords,
        );


    useEffect(() => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(words),
        );
    }, [words]);


    const isInGrammar = (
        word: GrammarWordRef,
    ): boolean => {
        return words.some(
            (item) =>
                item.category ===
                word.category &&
                item.id === word.id,
        );
    };


    const addWord = (
        word: GrammarWordRef,
    ) => {
        setWords((currentWords) => {
            const exists =
                currentWords.some(
                    (item) =>
                        item.category ===
                        word.category &&
                        item.id === word.id,
                );

            if (exists) {
                return currentWords;
            }

            return [
                ...currentWords,
                word,
            ];
        });
    };


    const removeWord = (
        word: GrammarWordRef,
    ) => {
        setWords((currentWords) =>
            currentWords.filter(
                (item) =>
                    !(
                        item.category ===
                        word.category &&
                        item.id === word.id
                    ),
            ),
        );
    };


    const clearGrammar = () => {
        setWords([]);
    };


    return (
        <GrammarContext.Provider
            value={{
                words,
                count: words.length,
                addWord,
                removeWord,
                isInGrammar,
                clearGrammar,
            }}
        >
            {children}
        </GrammarContext.Provider>
    );
}