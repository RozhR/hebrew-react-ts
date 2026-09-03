import { useState } from "react";

import "./App.css";

import Navbar from "./components/Navbar";
import CardList from "./components/CardList";
import { Test } from "./components/Test";

import { verbsData } from "./data/verbs";
import { adjectivesData } from "./data/adjectives";
import { adverbsData } from "./data/adverbs";

import type { Category } from "./types";

function App() {
    const [category, setCategory] =
        useState<Category>("verbs");

    const [level, setLevel] =
        useState(1);

    const [isTesting, setIsTesting] =
        useState(false);

    const getCards = () => {
        switch (category) {
            case "verbs":
                return verbsData[level] ?? [];

            case "adjectives":
                return adjectivesData[level] ?? [];

            case "adverbs":
                return adverbsData[level] ?? [];

            default:
                return [];
        }
    };

    const cards = getCards();

    const handleSelectLevel = (
        selectedCategory: Category,
        selectedLevel: number,
    ) => {
        setCategory(selectedCategory);
        setLevel(selectedLevel);
        setIsTesting(false);
    };

    const categoryTitle =
        category === "verbs"
            ? "Глаголы"
            : category === "adjectives"
                ? "Прилагательные"
                : "Наречия";

    return (
        <>
            <Navbar
                onSelectLevel={handleSelectLevel}
            />

            <h2 className="level-title">
                {categoryTitle} — Уровень {level}
            </h2>

            {isTesting ? (
                <Test
                    key={`${category}-${level}`}
                    words={cards}
                    category={category}
                    level={level}
                    onBackToCards={() =>
                        setIsTesting(false)
                    }
                />
            ) : (
                <CardList
                    key={`${category}-${level}`}
                    cards={cards}
                    onStartTest={() =>
                        setIsTesting(true)
                    }
                />
            )}
        </>
    );
}

export default App;