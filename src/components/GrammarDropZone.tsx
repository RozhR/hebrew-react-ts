import {
    type DragEvent,
    useState,
} from "react";

import { useGrammar } from "../context/GrammarContext";

import type { Category } from "../types";


type DraggedGrammarWord = {
    category: Category;
    id: number;
};


function isCategory(
    value: unknown,
): value is Category {
    return (
        value === "verbs" ||
        value === "adjectives" ||
        value === "adverbs"
    );
}


function GrammarDropZone() {
    const [isDraggingOver, setIsDraggingOver] =
        useState(false);

    const [justAdded, setJustAdded] =
        useState(false);

    const {
        addWord,
        count,
    } = useGrammar();


    const handleDragOver = (
        event: DragEvent<HTMLDivElement>,
    ) => {
        event.preventDefault();

        event.dataTransfer.dropEffect =
            "copy";

        setIsDraggingOver(true);
    };


    const handleDragLeave = () => {
        setIsDraggingOver(false);
    };


    const handleDrop = (
        event: DragEvent<HTMLDivElement>,
    ) => {
        event.preventDefault();

        setIsDraggingOver(false);

        try {
            const rawData =
                event.dataTransfer.getData(
                    "application/json",
                );

            if (!rawData) {
                return;
            }

            const parsed: unknown =
                JSON.parse(rawData);

            if (
                typeof parsed !== "object" ||
                parsed === null
            ) {
                return;
            }

            const word =
                parsed as Record<
                    string,
                    unknown
                >;

            if (
                !isCategory(word.category) ||
                typeof word.id !== "number" ||
                !Number.isInteger(word.id)
            ) {
                return;
            }

            const grammarWord:
                DraggedGrammarWord = {
                category:
                word.category,
                id: word.id,
            };

            addWord(grammarWord);

            setJustAdded(true);

            window.setTimeout(() => {
                setJustAdded(false);
            }, 1000);
        } catch {
            setIsDraggingOver(false);
        }
    };


    return (
        <div
            className={`grammar-drop-zone ${
                isDraggingOver
                    ? "drag-over"
                    : ""
            } ${
                justAdded
                    ? "added"
                    : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <h3 className="grammar-drop-title">
                Грамматика
            </h3>

            <div className="grammar-drop-inner">
                <div className="grammar-drop-header">
                    <strong>
                        Выбрано слов
                    </strong>

                    <span className="grammar-drop-count">
                        {count}
                    </span>
                </div>

                <div className="grammar-drop-message">
                    {justAdded ? (
                        <span className="grammar-added-text">
                            ✓ Добавлено
                        </span>
                    ) : (
                        <>
                            <span className="desktop-grammar-hint">
                                Перетащите карточку сюда
                            </span>

                            <span className="touch-grammar-hint">
                                Удерживайте карточку
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}


export default GrammarDropZone;