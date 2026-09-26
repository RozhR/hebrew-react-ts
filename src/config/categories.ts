import type { Category } from "../types";

export interface CategoryConfig {
    title: string;
    levels: number;
}

export const CARDS_PER_LEVEL = 20;

export const CATEGORY_CONFIG: Record<Category, CategoryConfig> = {
    verbs: {
        title: "Глаголы",
        levels: 25,
    },
    adjectives: {
        title: "Прилагательные",
        levels: 25,
    },
    adverbs: {
        title: "Наречия",
        levels: 15,
    },
};

export const CATEGORIES = Object.keys(CATEGORY_CONFIG) as Category[];

export function isCategory(value: unknown): value is Category {
    return typeof value === "string" && CATEGORIES.includes(value as Category);
}
