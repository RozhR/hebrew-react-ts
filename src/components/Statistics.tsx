import { useState } from "react";

import type {
    Category,
    TestStats,
} from "../types";

const categoryTitles: Record<Category, string> = {
    verbs: "Глаголы",
    adjectives: "Прилагательные",
    adverbs: "Наречия",
};

function Statistics() {
    const [stats, setStats] = useState<TestStats>(() => {
        try {
            const savedStats =
                localStorage.getItem("testStats");

            return savedStats
                ? JSON.parse(savedStats)
                : {};
        } catch {
            return {};
        }
    });

    const clearStatistics = () => {
        localStorage.removeItem("testStats");
        setStats({});

        window.dispatchEvent(
            new Event("levelsUpdated"),
        );
    };

    const categories: Category[] = [
        "verbs",
        "adjectives",
        "adverbs",
    ];

    const hasStatistics = categories.some(
        (category) =>
            Object.keys(stats[category] ?? {}).length > 0,
    );

    return (
        <div className="statistics-page">
            <h2 className="statistics-title">
                Статистика
            </h2>

            {!hasStatistics ? (
                <p className="statistics-empty">
                    Статистика пока отсутствует.
                    Пройдите хотя бы один тест.
                </p>
            ) : (
                <div className="statistics-container">
                    {categories.map((category) => {
                        const categoryStats =
                            stats[category];

                        const levels = Object.entries(
                            categoryStats ?? {},
                        ).sort(
                            ([levelA], [levelB]) =>
                                Number(levelA) -
                                Number(levelB),
                        );

                        return (
                            <section
                                className="statistics-category"
                                key={category}
                            >
                                <h3>
                                    {
                                        categoryTitles[
                                            category
                                            ]
                                    }
                                </h3>

                                {levels.length === 0 ? (
                                    <p className="statistics-no-results">
                                        Нет результатов
                                    </p>
                                ) : (
                                    levels.map(
                                        ([
                                             level,
                                             attempts,
                                         ]) => {
                                            const bestAttempt =
                                                attempts.reduce(
                                                    (
                                                        best,
                                                        current,
                                                    ) =>
                                                        current.percent >
                                                        best.percent
                                                            ? current
                                                            : best,
                                                );

                                            const progressClass =
                                                bestAttempt.percent >=
                                                80
                                                    ? "progress-good"
                                                    : bestAttempt.percent >=
                                                    50
                                                        ? "progress-medium"
                                                        : "progress-low";

                                            return (
                                                <div
                                                    className="statistics-level"
                                                    key={
                                                        level
                                                    }
                                                >
                                                    <div className="statistics-level-header">
                                                        <strong>
                                                            Уровень{" "}
                                                            {
                                                                level
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                bestAttempt.percent
                                                            }
                                                            %
                                                        </span>
                                                    </div>

                                                    <div className="statistics-progress">
                                                        <div
                                                            className={`statistics-progress-fill ${progressClass}`}
                                                            style={{
                                                                width: `${bestAttempt.percent}%`,
                                                            }}
                                                        />
                                                    </div>

                                                    <p>
                                                        Правильных
                                                        ответов:{" "}
                                                        {
                                                            bestAttempt.correct
                                                        }{" "}
                                                        из{" "}
                                                        {
                                                            bestAttempt.total
                                                        }
                                                    </p>

                                                    <p className="statistics-date">
                                                        Лучшая
                                                        попытка:{" "}
                                                        {new Date(
                                                            bestAttempt.date,
                                                        ).toLocaleString()}
                                                    </p>

                                                    <p className="statistics-attempts">
                                                        Попыток:{" "}
                                                        {
                                                            attempts.length
                                                        }
                                                    </p>
                                                </div>
                                            );
                                        },
                                    )
                                )}
                            </section>
                        );
                    })}
                </div>
            )}

            {hasStatistics && (
                <button
                    type="button"
                    className="styled-btn clear-statistics-btn"
                    onClick={clearStatistics}
                >
                    Очистить статистику
                </button>
            )}
        </div>
    );
}

export default Statistics;