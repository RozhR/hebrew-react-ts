export type Category = "verbs" | "adjectives" | "adverbs";

export interface CardData {
    hebrew: string;
    russian: string;
}

export interface CardWithId extends CardData {
    id: number;
}

export interface TestAttempt {
    percent: number;
    correct: number;
    total: number;
    date: string;
}

export type TestStats = Partial<Record<Category, Record<number, TestAttempt[]>>>;
