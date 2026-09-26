import { CATEGORY_CONFIG, CATEGORIES } from "../config/categories";

import { PASS_PERCENT } from "../config/test";

import type { Category, TestStats } from "../types";

type UserProgress = Record<Category, number>;

const DEFAULT_PROGRESS: UserProgress = {
    verbs: 1,
    adjectives: 1,
    adverbs: 1,
};

function getProgressFromStatistics(): UserProgress {
    const progress: UserProgress = {
        ...DEFAULT_PROGRESS,
    };

    try {
        const savedStats = localStorage.getItem("testStats");

        if (!savedStats) {
            return progress;
        }

        const stats: TestStats = JSON.parse(savedStats);

        CATEGORIES.forEach((category) => {
            const categoryStats = stats[category];

            if (!categoryStats) {
                return;
            }

            Object.entries(categoryStats).forEach(([levelString, attempts]) => {
                const level = Number(levelString);

                const passed = attempts.some((attempt) => attempt.percent >= PASS_PERCENT);

                if (!passed) {
                    return;
                }

                const nextLevel = Math.min(level + 1, CATEGORY_CONFIG[category].levels);

                progress[category] = Math.max(progress[category], nextLevel);
            });
        });
    } catch {
        return progress;
    }

    return progress;
}

function loadProgress(): UserProgress {
    try {
        const savedProgress = localStorage.getItem("userProgress");

        if (savedProgress) {
            return {
                ...DEFAULT_PROGRESS,
                ...JSON.parse(savedProgress),
            };
        }
    } catch {
        // Создадим прогресс заново.
    }

    /*
     * Миграция со старой версии:
     * если userProgress ещё нет,
     * восстанавливаем открытые уровни
     * из существующей статистики.
     */
    const migratedProgress = getProgressFromStatistics();

    localStorage.setItem("userProgress", JSON.stringify(migratedProgress));

    return migratedProgress;
}

export function unlockNextLevel(category: Category, level: number): void {
    const progress = loadProgress();

    const nextLevel = Math.min(level + 1, CATEGORY_CONFIG[category].levels);

    progress[category] = Math.max(progress[category], nextLevel);

    localStorage.setItem("userProgress", JSON.stringify(progress));

    window.dispatchEvent(new Event("levelsUpdated"));
}

export function isLevelUnlocked(category: Category, level: number): boolean {
    if (level === 1) {
        return true;
    }

    const progress = loadProgress();

    return level <= progress[category];
}
