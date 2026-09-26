import type { Category } from "../types";

export interface CategoryConfig {
    title: string;
    levels: number;
}

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
