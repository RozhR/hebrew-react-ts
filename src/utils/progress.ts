import type {
    Category,
    TestStats,
} from "../types";

export function isLevelUnlocked(
    category: Category,
    level: number,
): boolean {
    if (level === 1) {
        return true;
    }

    const stats: TestStats = (() => {
        try {
            const savedStats =
                localStorage.getItem("testStats");

            return savedStats
                ? JSON.parse(savedStats)
                : {};
        } catch {
            return {};
        }
    })();

    const previousLevelAttempts =
        stats[category]?.[level - 1] ?? [];

    return previousLevelAttempts.some(
        (attempt) =>
            attempt.percent >= 85,
    );
}