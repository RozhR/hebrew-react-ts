import type { VerbGrammar } from "../../types/grammar";

export type GrammarTestSection = "present" | "past" | "future" | "imperative";

export interface GrammarQuestion {
    id: string;
    infinitive: string;
    translation: string;
    section: GrammarTestSection;
    sectionTitle: string;
    person: string;
    correctAnswer: string;
    answers: string[];
}

export interface GrammarTestAttempt {
    percent: number;
    correct: number;
    total: number;
    date: string;
    sections: GrammarTestSection[];
}

interface VerbForm {
    person: string;
    value: string;
}

export const SECTION_TITLES: Record<GrammarTestSection, string> = {
    present: "Настоящее время",
    past: "Прошедшее время",
    future: "Будущее время",
    imperative: "Повелительное наклонение",
};

export const GRAMMAR_TEST_SECTIONS: GrammarTestSection[] = [
    "present",
    "past",
    "future",
    "imperative",
];

function shuffleArray<T>(array: T[]): T[] {
    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

function isValidForm(value: string): boolean {
    const trimmed = value.trim();

    return trimmed !== "" && trimmed !== "—";
}

function getPresentForms(grammar: VerbGrammar): VerbForm[] {
    return [
        {
            person: "הוא",
            value: grammar.present.masculine_singular,
        },
        {
            person: "היא",
            value: grammar.present.feminine_singular,
        },
        {
            person: "הם",
            value: grammar.present.masculine_plural,
        },
        {
            person: "הן",
            value: grammar.present.feminine_plural,
        },
    ];
}

function getPastForms(grammar: VerbGrammar): VerbForm[] {
    return [
        {
            person: "אני",
            value: grammar.past.first_person_singular,
        },
        {
            person: "אתה",
            value: grammar.past.second_person_masculine_singular,
        },
        {
            person: "את",
            value: grammar.past.second_person_feminine_singular,
        },
        {
            person: "הוא",
            value: grammar.past.third_person_masculine_singular,
        },
        {
            person: "היא",
            value: grammar.past.third_person_feminine_singular,
        },
        {
            person: "אנחנו",
            value: grammar.past.first_person_plural,
        },
        {
            person: "אתם",
            value: grammar.past.second_person_masculine_plural,
        },
        {
            person: "אתן",
            value: grammar.past.second_person_feminine_plural,
        },
        {
            person: "הם / הן",
            value: grammar.past.third_person_plural,
        },
    ];
}

function getFutureForms(grammar: VerbGrammar): VerbForm[] {
    return [
        {
            person: "אני",
            value: grammar.future.first_person_singular,
        },
        {
            person: "אתה",
            value: grammar.future.second_person_masculine_singular,
        },
        {
            person: "את",
            value: grammar.future.second_person_feminine_singular,
        },
        {
            person: "הוא",
            value: grammar.future.third_person_masculine_singular,
        },
        {
            person: "היא",
            value: grammar.future.third_person_feminine_singular,
        },
        {
            person: "אנחנו",
            value: grammar.future.first_person_plural,
        },
        {
            person: "אתם",
            value: grammar.future.second_person_masculine_plural,
        },
        {
            person: "אתן",
            value: grammar.future.second_person_feminine_plural,
        },
        {
            person: "הם / הן",
            value: grammar.future.third_person_plural,
        },
    ];
}

function getImperativeForms(grammar: VerbGrammar): VerbForm[] {
    return [
        {
            person: "אתה",
            value: grammar.future.imperative_masculine,
        },
        {
            person: "את",
            value: grammar.future.imperative_feminine,
        },
        {
            person: "אתם / אתן",
            value: grammar.future.imperative_plural,
        },
    ];
}

function getSectionForms(grammar: VerbGrammar, section: GrammarTestSection): VerbForm[] {
    switch (section) {
        case "present":
            return getPresentForms(grammar);

        case "past":
            return getPastForms(grammar);

        case "future":
            return getFutureForms(grammar);

        case "imperative":
            return getImperativeForms(grammar);
    }
}

function getAllForms(grammar: VerbGrammar): string[] {
    return [
        ...getPresentForms(grammar),
        ...getPastForms(grammar),
        ...getFutureForms(grammar),
        ...getImperativeForms(grammar),
    ]
        .map((item) => item.value)
        .filter(isValidForm);
}

export function createQuestions(
    grammars: VerbGrammar[],
    sections: GrammarTestSection[],
): GrammarQuestion[] {
    const questions: GrammarQuestion[] = [];

    grammars.forEach((grammar) => {
        /*
         * Все варианты ответа берём только
         * из форм текущего глагола.
         */
        const allCurrentVerbForms = Array.from(new Set(getAllForms(grammar)));

        sections.forEach((section) => {
            const forms = getSectionForms(grammar, section);

            /*
             * В первую очередь используются
             * формы текущего времени.
             */
            const sameSectionForms = Array.from(
                new Set(forms.map((item) => item.value).filter(isValidForm)),
            );

            forms.forEach((form, index) => {
                if (!isValidForm(form.value)) {
                    return;
                }

                /*
                 * Если в текущем времени
                 * вариантов недостаточно,
                 * добавляем формы других времён,
                 * но всё равно только этого глагола.
                 */
                const wrongCandidates = Array.from(
                    new Set([...sameSectionForms, ...allCurrentVerbForms]),
                ).filter((value) => value !== form.value);

                if (wrongCandidates.length < 3) {
                    return;
                }

                const wrongAnswers = shuffleArray(wrongCandidates).slice(0, 3);

                const answers = shuffleArray([form.value, ...wrongAnswers]);

                questions.push({
                    id: `${grammar.base.id}-${section}-${index}`,
                    infinitive: grammar.base.infinitive,
                    translation: grammar.base.translation,
                    section,
                    sectionTitle: SECTION_TITLES[section],
                    person: form.person,
                    correctAnswer: form.value,
                    answers,
                });
            });
        });
    });

    return shuffleArray(questions);
}

export function saveGrammarTestAttempt(attempt: GrammarTestAttempt): void {
    const key = "grammarTestStats";

    try {
        const saved = localStorage.getItem(key);

        const attempts: GrammarTestAttempt[] = saved ? JSON.parse(saved) : [];

        attempts.push(attempt);

        localStorage.setItem(key, JSON.stringify(attempts));
    } catch {
        localStorage.setItem(key, JSON.stringify([attempt]));
    }
}
