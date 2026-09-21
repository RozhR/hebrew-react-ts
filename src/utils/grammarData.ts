import verbsBase from "../data/grammar/verbs/base.json";
import verbsPresent from "../data/grammar/verbs/present.json";
import verbsPast from "../data/grammar/verbs/past.json";
import verbsFutureImperative from "../data/grammar/verbs/futureImperative.json";
import verbsExamples from "../data/grammar/verbs/examples.json";

import adjectivesBase from "../data/grammar/adjectives/base.json";
import adjectivesConstructions from "../data/grammar/adjectives/constructions.json";
import adjectivesExamples from "../data/grammar/adjectives/examples.json";

import adverbsBase from "../data/grammar/adverbs/base.json";
import adverbsUsage from "../data/grammar/adverbs/usage.json";
import adverbsRelations from "../data/grammar/adverbs/relations.json";
import adverbsExamples from "../data/grammar/adverbs/examples.json";

import type {
    AdjectiveGrammar,
    AdverbGrammar,
    GrammarCategory,
    VerbGrammar,
} from "../types/grammar";


function findById<T extends { id: number }>(
    items: T[],
    id: number,
): T | undefined {
    return items.find((item) => item.id === id);
}


export function getVerbGrammar(
    id: number,
): VerbGrammar | undefined {
    const base = findById(verbsBase, id);
    const present = findById(verbsPresent, id);
    const past = findById(verbsPast, id);
    const future = findById(
        verbsFutureImperative,
        id,
    );
    const examples = findById(verbsExamples, id);

    if (
        !base ||
        !present ||
        !past ||
        !future ||
        !examples
    ) {
        return undefined;
    }

    return {
        base,
        present,
        past,
        future,
        examples,
    };
}


export function getAdjectiveGrammar(
    id: number,
): AdjectiveGrammar | undefined {
    const base = findById(adjectivesBase, id);
    const construction = findById(
        adjectivesConstructions,
        id,
    );
    const examples = findById(
        adjectivesExamples,
        id,
    );

    if (!base || !examples) {
        return undefined;
    }

    return {
        base,
        construction,
        examples,
    };
}


export function getAdverbGrammar(
    id: number,
): AdverbGrammar | undefined {
    const base = findById(adverbsBase, id);
    const usage = findById(adverbsUsage, id);
    const relation = findById(
        adverbsRelations,
        id,
    );
    const examples = findById(
        adverbsExamples,
        id,
    );

    if (!base || !usage || !examples) {
        return undefined;
    }

    return {
        base,
        usage,
        relation,
        examples,
    };
}


export function getGrammarWord(
    category: GrammarCategory,
    id: number,
) {
    switch (category) {
        case "verbs":
            return getVerbGrammar(id);

        case "adjectives":
            return getAdjectiveGrammar(id);

        case "adverbs":
            return getAdverbGrammar(id);

        default:
            return undefined;
    }
}