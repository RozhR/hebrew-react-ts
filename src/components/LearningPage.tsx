import {
    Navigate,
    useNavigate,
    useParams,
} from "react-router-dom";

import CardList from "./CardList";
import { Test } from "./Test";

import { verbsData } from "../data/verbs";
import { adjectivesData } from "../data/adjectives";
import { adverbsData } from "../data/adverbs";

import type { Category } from "../types";


const categoryTitles: Record<Category, string> = {
    verbs: "Глаголы",
    adjectives: "Прилагательные",
    adverbs: "Наречия",
};


const categoryLevels: Record<Category, number> = {
    verbs: 25,
    adjectives: 25,
    adverbs: 15,
};


function isCategory(
    value: string | undefined,
): value is Category {
    return (
        value === "verbs" ||
        value === "adjectives" ||
        value === "adverbs"
    );
}


function getCards(
    category: Category,
    level: number,
) {
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


function LearningPage({
                          testMode = false,
                      }: LearningPageProps) {
    const navigate = useNavigate();

    const {
        category: categoryParam,
        level: levelParam,
    } = useParams();

    if (!isCategory(categoryParam)) {
        return (
            <Navigate
                to="/verbs/1"
                replace
            />
        );
    }

    const level = Number(levelParam);

    const maxLevel =
        categoryLevels[categoryParam];

    if (
        !Number.isInteger(level) ||
        level < 1 ||
        level > maxLevel
    ) {
        return (
            <Navigate
                to={`/${categoryParam}/1`}
                replace
            />
        );
    }

    const cards = getCards(
        categoryParam,
        level,
    );

    const categoryTitle =
        categoryTitles[categoryParam];

    return (
        <>
            <h2 className="level-title">
                {categoryTitle} — Уровень{" "}
                {level}
            </h2>

            {testMode ? (
                <Test
                    key={`${categoryParam}-${level}`}
                    words={cards}
                    category={categoryParam}
                    level={level}
                    onBackToCards={() =>
                        navigate(
                            `/${categoryParam}/${level}`,
                        )
                    }
                />
            ) : (
                <CardList
                    key={`${categoryParam}-${level}`}
                    cards={cards}
                    onStartTest={() =>
                        navigate(
                            `/${categoryParam}/${level}/test`,
                        )
                    }
                />
            )}
        </>
    );
}

export default LearningPage;