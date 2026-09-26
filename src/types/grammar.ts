import type { Category } from "../types";

export interface GrammarWordRef {
    category: Category;
    id: number;
}

/* =========================================================
   VERBS
   ========================================================= */

export interface VerbBase {
    id: number;
    infinitive: string;
    translation: string;
    government: string;
    level: number;
}

export interface VerbPresent {
    id: number;
    infinitive: string;
    binyan: string;

    masculine_singular: string;
    feminine_singular: string;
    masculine_plural: string;
    feminine_plural: string;
}

export interface VerbPast {
    id: number;
    infinitive: string;

    first_person_singular: string;

    second_person_masculine_singular: string;
    second_person_feminine_singular: string;

    third_person_masculine_singular: string;
    third_person_feminine_singular: string;

    first_person_plural: string;

    second_person_masculine_plural: string;
    second_person_feminine_plural: string;

    third_person_plural: string;
}

export interface VerbFutureImperative {
    id: number;
    infinitive: string;

    first_person_singular: string;

    second_person_masculine_singular: string;
    second_person_feminine_singular: string;

    third_person_masculine_singular: string;
    third_person_feminine_singular: string;

    first_person_plural: string;

    second_person_masculine_plural: string;
    second_person_feminine_plural: string;

    third_person_plural: string;

    imperative_masculine: string;
    imperative_feminine: string;
    imperative_plural: string;
}

export interface VerbExamples {
    id: number;
    infinitive: string;
    translation: string;

    present_example: string;
    present_translation: string;

    past_example: string;
    past_translation: string;

    future_example: string;
    future_translation: string;
}

export interface VerbGrammar {
    base: VerbBase;
    present: VerbPresent;
    past: VerbPast;
    future: VerbFutureImperative;
    examples: VerbExamples;
}

/* =========================================================
   ADJECTIVES
   ========================================================= */

export interface AdjectiveBase {
    id: number;

    masculine_singular: string;
    feminine_singular: string;
    masculine_plural: string;
    feminine_plural: string;

    translation: string;
    level: number;
}

export interface AdjectiveConstruction {
    id: number;
    adjective: string;
    construction: string;
    meaning: string;
}

export interface AdjectiveExamples {
    id: number;
    adjective: string;
    translation: string;

    example1: string;
    translation1: string;

    example2: string;
    translation2: string;

    example3: string;
    translation3: string;
}

export interface AdjectiveGrammar {
    base: AdjectiveBase;
    construction?: AdjectiveConstruction;
    examples: AdjectiveExamples;
}

/* =========================================================
   ADVERBS
   ========================================================= */

export interface AdverbBase {
    id: number;
    adverb: string;
    translation: string;
    category: string;
    level: number;
}

export interface AdverbUsage {
    id: number;
    adverb: string;

    main_meaning: string;
    category: string;
    register: string;
    usage: string;
}

export interface AdverbRelation {
    id: number;
    adverb: string;

    synonym: string;
    antonym: string;
    related_expression: string;
    comment: string;
}

export interface AdverbExamples {
    id: number;
    adverb: string;
    category: string;

    example1: string;
    translation1: string;

    example2: string;
    translation2: string;

    example3: string;
    translation3: string;
}

export interface AdverbGrammar {
    base: AdverbBase;
    usage: AdverbUsage;
    relation?: AdverbRelation;
    examples: AdverbExamples;
}
