import type {
    Category,
    TestStats,
} from "../types";


type UserProgress = Record<
    Category,
    number
>;


const DEFAULT_PROGRESS: UserProgress = {
    verbs: 1,
    adjectives: 1,
    adverbs: 1,
};


const categoryLevels: Record<
    Category,
    number
> = {
    verbs: 25,
    adjectives: 25,
    adverbs: 15,
};


function getProgressFromStatistics():
    UserProgress {
    const progress: UserProgress = {
        ...DEFAULT_PROGRESS,
    };

    try {
        const savedStats =
            localStorage.getItem(
                "testStats",
            );

        if (!savedStats) {
            return progress;
        }

        const stats: TestStats =
            JSON.parse(savedStats);

        (
            Object.keys(
                progress,
            ) as Category[]
        ).forEach(
            (category) => {
                const categoryStats =
                    stats[category];

                if (!categoryStats) {
                    return;
                }

                Object.entries(
                    categoryStats,
                ).forEach(
                    ([
                         levelString,
                         attempts,
                     ]) => {
                        const level =
                            Number(
                                levelString,
                            );

                        const passed =
                            attempts.some(
                                (attempt) =>
                                    attempt.percent >=
                                    85,
                            );

                        if (!passed) {
                            return;
                        }

                        const nextLevel =
                            Math.min(
                                level + 1,
                                categoryLevels[
                                    category
                                    ],
                            );

                        progress[
                            category
                            ] =
                            Math.max(
                                progress[
                                    category
                                    ],
                                nextLevel,
                            );
                    },
                );
            },
        );
    } catch {
        return progress;
    }

    return progress;
}


function loadProgress():
    UserProgress {
    try {
        const savedProgress =
            localStorage.getItem(
                "userProgress",
            );

        if (savedProgress) {
            return {
                ...DEFAULT_PROGRESS,
                ...JSON.parse(
                    savedProgress,
                ),
            };
        }
    } catch {
        // создадим прогресс заново
    }


    /*
     * Важно для перехода со старой версии:
     *
     * если userProgress ещё нет,
     * берём уже открытые уровни
     * из существующей статистики.
     */
    const migratedProgress =
        getProgressFromStatistics();

    localStorage.setItem(
        "userProgress",
        JSON.stringify(
            migratedProgress,
        ),
    );

    return migratedProgress;
}


export function unlockNextLevel(
    category: Category,
    level: number,
): void {
    const progress =
        loadProgress();

    const nextLevel =
        Math.min(
            level + 1,
            categoryLevels[
                category
                ],
        );

    progress[category] =
        Math.max(
            progress[category],
            nextLevel,
        );

    localStorage.setItem(
        "userProgress",
        JSON.stringify(
            progress,
        ),
    );

    window.dispatchEvent(
        new Event(
            "levelsUpdated",
        ),
    );
}


export function isLevelUnlocked(
    category: Category,
    level: number,
): boolean {
    if (level === 1) {
        return true;
    }

    const progress =
        loadProgress();

    return (
        level <=
        progress[category]
    );
}