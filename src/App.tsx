import { useState } from "react";

import "./App.css";

import Navbar from "./components/Navbar";
import CardList from "./components/CardList";
import { Test } from "./components/Test";
import Statistics from "./components/Statistics";

import { verbsData } from "./data/verbs";
import { adjectivesData } from "./data/adjectives";
import { adverbsData } from "./data/adverbs";

import type { Category } from "./types";

type Page = "cards" | "test" | "statistics";

function App() {
    const [category, setCategory] =
        useState<Category>("verbs");

    const [level, setLevel] =
        useState(1);

    const [page, setPage] =
        useState<Page>("cards");

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
        setPage("cards");
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
                onShowStatistics={() =>
                    setPage("statistics")
                }
            />

            {page === "statistics" ? (
                <Statistics />
            ) : (
                <>
                    <h2 className="level-title">
                        {categoryTitle} — Уровень{" "}
                        {level}
                    </h2>

                    {page === "test" ? (
                        <Test
                            key={`${category}-${level}`}
                            words={cards}
                            category={category}
                            level={level}
                            onBackToCards={() =>
                                setPage("cards")
                            }
                        />
                    ) : (
                        <CardList
                            key={`${category}-${level}`}
                            cards={cards}
                            onStartTest={() =>
                                setPage("test")
                            }
                        />
                    )}
                </>
            )}
        </>
    );
}

export default App;