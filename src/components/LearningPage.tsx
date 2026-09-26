import { Navigate, useNavigate, useParams } from "react-router-dom";

import CardList from "./CardList";
import { Test } from "./Test";

import { CARDS_PER_LEVEL, CATEGORY_CONFIG, isCategory } from "../config/categories";

import { adjectivesData } from "../data/adjectives";
import { adverbsData } from "../data/adverbs";
import { verbsData } from "../data/verbs";

import { isLevelUnlocked } from "../utils/progress";

import type { Category } from "../types";

function getCards(category: Category, level: number) {
    switch (category) {
        case "verbs":
            return verbsData[level] ?? [];

        case "adjectives":
            return adjectivesData[level] ?? [];

        case "adverbs":
            return adverbsData[level] ?? [];
    }
}

type LearningPageProps = {
    testMode?: boolean;
};

function LearningPage({ testMode = false }: LearningPageProps) {
    const navigate = useNavigate();

    const { category: categoryParam, level: levelParam } = useParams();

    if (!isCategory(categoryParam)) {
        return <Navigate to="/verbs/1" replace />;
    }

    const level = Number(levelParam);

    const categoryConfig = CATEGORY_CONFIG[categoryParam];

    const maxLevel = categoryConfig.levels;

    if (!Number.isInteger(level) || level < 1 || level > maxLevel) {
        return <Navigate to={`/${categoryParam}/1`} replace />;
    }

    if (!isLevelUnlocked(categoryParam, level)) {
        return <Navigate to={`/${categoryParam}/1`} replace />;
    }

    const cards = getCards(categoryParam, level);

    const cardsWithIds = cards.map((card, index) => ({
        ...card,

        id: (level - 1) * CARDS_PER_LEVEL + index + 1,
    }));

    return (
        <>
            <h2 className="level-title">
                {categoryConfig.title} — Уровень {level}
            </h2>

            {testMode ? (
                <Test
                    key={`${categoryParam}-${level}`}
                    words={cards}
                    category={categoryParam}
                    level={level}
                    isLastLevel={level === maxLevel}
                    onBackToCards={() => navigate(`/${categoryParam}/${level}`)}
                />
            ) : (
                <CardList
                    key={`${categoryParam}-${level}`}
                    cards={cardsWithIds}
                    category={categoryParam}
                    onStartTest={() => navigate(`/${categoryParam}/${level}/test`)}
                />
            )}
        </>
    );
}

export default LearningPage;
