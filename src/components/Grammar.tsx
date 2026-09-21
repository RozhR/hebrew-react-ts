import {
    type ReactNode,
    useState,
} from "react";

import { useGrammar } from "../context/GrammarContext";

import {
    getAdjectiveGrammar,
    getAdverbGrammar,
    getVerbGrammar,
} from "../utils/grammarData";

import type {
    AdjectiveGrammar,
    AdverbGrammar,
    GrammarWordRef,
    VerbGrammar,
} from "../types/grammar";


type FormItem = {
    label: string;
    value: string;
};


type GrammarCardProps = {
    title: string;
    translation: string;
    level: number;
    expanded: boolean;
    onToggle: () => void;
    onRemove: () => void;
    children: ReactNode;
};


function GrammarCard({
                         title,
                         translation,
                         level,
                         expanded,
                         onToggle,
                         onRemove,
                         children,
                     }: GrammarCardProps) {
    return (
        <article className="grammar-word-card">
            <div className="grammar-word-header">
                <div>
                    <h3
                        className="grammar-word-hebrew"
                        dir="rtl"
                    >
                        {title}
                    </h3>

                    <p className="grammar-word-translation">
                        {translation}
                    </p>
                </div>

                <div className="grammar-word-meta">
                    <span>
                        Уровень {level}
                    </span>
                </div>
            </div>

            <div className="grammar-word-actions">
                <button
                    type="button"
                    className="grammar-details-btn"
                    onClick={onToggle}
                >
                    {expanded
                        ? "Свернуть"
                        : "Подробнее"}
                </button>

                <button
                    type="button"
                    className="grammar-remove-btn"
                    onClick={onRemove}
                >
                    Удалить
                </button>
            </div>

            {expanded && (
                <div className="grammar-word-details">
                    {children}
                </div>
            )}
        </article>
    );
}


function GrammarForms({
                          title,
                          items,
                      }: {
    title: string;
    items: FormItem[];
}) {
    return (
        <section className="grammar-detail-section">
            <h4>
                {title}
            </h4>

            <div className="grammar-forms-grid">
                {items.map((item) => (
                    <div
                        className="grammar-form-item"
                        key={item.label}
                    >
                        <span className="grammar-form-label">
                            {item.label}
                        </span>

                        <strong dir="rtl">
                            {item.value}
                        </strong>
                    </div>
                ))}
            </div>
        </section>
    );
}


function GrammarInfo({
                         label,
                         value,
                         hebrew = false,
                     }: {
    label: string;
    value: string;
    hebrew?: boolean;
}) {
    return (
        <div className="grammar-info-item">
            <span>
                {label}
            </span>

            <strong
                dir={
                    hebrew
                        ? "rtl"
                        : undefined
                }
            >
                {value}
            </strong>
        </div>
    );
}


function GrammarExample({
                            hebrew,
                            translation,
                        }: {
    hebrew: string;
    translation: string;
}) {
    return (
        <div className="grammar-example">
            <p
                className="grammar-example-hebrew"
                dir="rtl"
            >
                {hebrew}
            </p>

            <p className="grammar-example-translation">
                {translation}
            </p>
        </div>
    );
}


/* =========================================================
   VERB TENSE TABLE
   ========================================================= */

function VerbTenseTable({
                            grammar,
                        }: {
    grammar: VerbGrammar;
}) {
    const pronouns = [
        "אני",
        "אתה",
        "את",
        "הוא",
        "היא",
        "אנחנו",
        "אתם",
        "אתן",
        "הם / הן",
    ];


    const rows = [
        {
            tense: "Прошедшее",

            forms: [
                grammar.past
                    .first_person_singular,

                grammar.past
                    .second_person_masculine_singular,

                grammar.past
                    .second_person_feminine_singular,

                grammar.past
                    .third_person_masculine_singular,

                grammar.past
                    .third_person_feminine_singular,

                grammar.past
                    .first_person_plural,

                grammar.past
                    .second_person_masculine_plural,

                grammar.past
                    .second_person_feminine_plural,

                grammar.past
                    .third_person_plural,
            ],
        },

        {
            tense: "Будущее",

            forms: [
                grammar.future
                    .first_person_singular,

                grammar.future
                    .second_person_masculine_singular,

                grammar.future
                    .second_person_feminine_singular,

                grammar.future
                    .third_person_masculine_singular,

                grammar.future
                    .third_person_feminine_singular,

                grammar.future
                    .first_person_plural,

                grammar.future
                    .second_person_masculine_plural,

                grammar.future
                    .second_person_feminine_plural,

                grammar.future
                    .third_person_plural,
            ],
        },
    ];


    return (
        <section className="grammar-detail-section">
            <h4>
                Прошедшее и будущее время
            </h4>

            <div className="grammar-tense-table-wrapper">
                <table className="grammar-tense-table">
                    <thead>
                    <tr>
                        <th>
                            Время
                        </th>

                        {pronouns.map(
                            (pronoun) => (
                                <th
                                    key={pronoun}
                                    dir="rtl"
                                >
                                    {pronoun}
                                </th>
                            ),
                        )}
                    </tr>
                    </thead>

                    <tbody>
                    {rows.map((row) => (
                        <tr key={row.tense}>
                            <th>
                                {row.tense}
                            </th>

                            {row.forms.map(
                                (
                                    form,
                                    index,
                                ) => (
                                    <td
                                        key={`${row.tense}-${index}`}
                                        dir="rtl"
                                    >
                                        {form}
                                    </td>
                                ),
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}


/* =========================================================
   VERBS
   ========================================================= */

function VerbDetails({
                         grammar,
                     }: {
    grammar: VerbGrammar;
}) {
    return (
        <>
            <section className="grammar-detail-section">
                <h4>
                    Основная информация
                </h4>

                <div className="grammar-info-grid">
                    <GrammarInfo
                        label="Биньян"
                        value={
                            grammar.present
                                .binyan
                        }
                    />

                    <GrammarInfo
                        label="Управление / предлог"
                        value={
                            grammar.base
                                .government
                        }
                        hebrew
                    />
                </div>
            </section>


            <GrammarForms
                title="Настоящее время"
                items={[
                    {
                        label: "м. ед.",
                        value:
                        grammar.present
                            .masculine_singular,
                    },
                    {
                        label: "ж. ед.",
                        value:
                        grammar.present
                            .feminine_singular,
                    },
                    {
                        label: "м. мн.",
                        value:
                        grammar.present
                            .masculine_plural,
                    },
                    {
                        label: "ж. мн.",
                        value:
                        grammar.present
                            .feminine_plural,
                    },
                ]}
            />


            <VerbTenseTable
                grammar={grammar}
            />


            <GrammarForms
                title="Повелительное наклонение"
                items={[
                    {
                        label: "м. ед.",
                        value:
                        grammar.future
                            .imperative_masculine,
                    },
                    {
                        label: "ж. ед.",
                        value:
                        grammar.future
                            .imperative_feminine,
                    },
                    {
                        label: "мн.",
                        value:
                        grammar.future
                            .imperative_plural,
                    },
                ]}
            />


            <section className="grammar-detail-section">
                <h4>
                    Примеры
                </h4>

                <div className="grammar-examples">
                    <GrammarExample
                        hebrew={
                            grammar.examples
                                .present_example
                        }
                        translation={
                            grammar.examples
                                .present_translation
                        }
                    />

                    <GrammarExample
                        hebrew={
                            grammar.examples
                                .past_example
                        }
                        translation={
                            grammar.examples
                                .past_translation
                        }
                    />

                    <GrammarExample
                        hebrew={
                            grammar.examples
                                .future_example
                        }
                        translation={
                            grammar.examples
                                .future_translation
                        }
                    />
                </div>
            </section>
        </>
    );
}


/* =========================================================
   ADJECTIVES
   ========================================================= */

function AdjectiveDetails({
                              grammar,
                          }: {
    grammar: AdjectiveGrammar;
}) {
    return (
        <>
            <GrammarForms
                title="Формы"
                items={[
                    {
                        label: "м. ед.",
                        value:
                        grammar.base
                            .masculine_singular,
                    },
                    {
                        label: "ж. ед.",
                        value:
                        grammar.base
                            .feminine_singular,
                    },
                    {
                        label: "м. мн.",
                        value:
                        grammar.base
                            .masculine_plural,
                    },
                    {
                        label: "ж. мн.",
                        value:
                        grammar.base
                            .feminine_plural,
                    },
                ]}
            />


            {grammar.construction && (
                <section className="grammar-detail-section">
                    <h4>
                        Управление и конструкции
                    </h4>

                    <div className="grammar-info-grid">
                        <GrammarInfo
                            label="Конструкция"
                            value={
                                grammar
                                    .construction
                                    .construction
                            }
                            hebrew
                        />

                        <GrammarInfo
                            label="Значение"
                            value={
                                grammar
                                    .construction
                                    .meaning
                            }
                        />
                    </div>
                </section>
            )}


            <section className="grammar-detail-section">
                <h4>
                    Примеры
                </h4>

                <div className="grammar-examples">
                    <GrammarExample
                        hebrew={
                            grammar.examples
                                .example1
                        }
                        translation={
                            grammar.examples
                                .translation1
                        }
                    />

                    <GrammarExample
                        hebrew={
                            grammar.examples
                                .example2
                        }
                        translation={
                            grammar.examples
                                .translation2
                        }
                    />

                    <GrammarExample
                        hebrew={
                            grammar.examples
                                .example3
                        }
                        translation={
                            grammar.examples
                                .translation3
                        }
                    />
                </div>
            </section>
        </>
    );
}


/* =========================================================
   ADVERBS
   ========================================================= */

function AdverbDetails({
                           grammar,
                       }: {
    grammar: AdverbGrammar;
}) {
    return (
        <>
            <section className="grammar-detail-section">
                <h4>
                    Употребление
                </h4>

                <div className="grammar-info-grid">
                    <GrammarInfo
                        label="Значение"
                        value={
                            grammar.usage
                                .main_meaning
                        }
                    />

                    <GrammarInfo
                        label="Категория"
                        value={
                            grammar.usage
                                .category
                        }
                    />

                    <GrammarInfo
                        label="Регистр"
                        value={
                            grammar.usage
                                .register
                        }
                    />
                </div>

                <p className="grammar-usage-text">
                    {grammar.usage.usage}
                </p>
            </section>


            {grammar.relation && (
                <section className="grammar-detail-section">
                    <h4>
                        Связанные слова
                    </h4>

                    <div className="grammar-info-grid">
                        <GrammarInfo
                            label="Синоним"
                            value={
                                grammar.relation
                                    .synonym
                            }
                            hebrew
                        />

                        <GrammarInfo
                            label="Антоним"
                            value={
                                grammar.relation
                                    .antonym
                            }
                            hebrew
                        />

                        <GrammarInfo
                            label="Выражение"
                            value={
                                grammar.relation
                                    .related_expression
                            }
                            hebrew
                        />
                    </div>

                    <p className="grammar-usage-text">
                        {
                            grammar.relation
                                .comment
                        }
                    </p>
                </section>
            )}


            <section className="grammar-detail-section">
                <h4>
                    Примеры
                </h4>

                <div className="grammar-examples">
                    <GrammarExample
                        hebrew={
                            grammar.examples
                                .example1
                        }
                        translation={
                            grammar.examples
                                .translation1
                        }
                    />

                    <GrammarExample
                        hebrew={
                            grammar.examples
                                .example2
                        }
                        translation={
                            grammar.examples
                                .translation2
                        }
                    />

                    <GrammarExample
                        hebrew={
                            grammar.examples
                                .example3
                        }
                        translation={
                            grammar.examples
                                .translation3
                        }
                    />
                </div>
            </section>
        </>
    );
}


/* =========================================================
   GRAMMAR PAGE
   ========================================================= */

function Grammar() {
    const {
        words,
        count,
        removeWord,
        clearGrammar,
    } = useGrammar();


    const [expandedWords, setExpandedWords] =
        useState<Set<string>>(
            new Set(),
        );


    const getWordKey = (
        word: GrammarWordRef,
    ) => {
        return `${word.category}-${word.id}`;
    };


    const toggleWord = (
        word: GrammarWordRef,
    ) => {
        const key =
            getWordKey(word);

        setExpandedWords(
            (current) => {
                const next =
                    new Set(current);

                if (next.has(key)) {
                    next.delete(key);
                } else {
                    next.add(key);
                }

                return next;
            },
        );
    };


    const handleClearGrammar = () => {
        const confirmed =
            window.confirm(
                "Удалить все выбранные слова из грамматики?",
            );

        if (!confirmed) {
            return;
        }

        clearGrammar();

        setExpandedWords(
            new Set(),
        );
    };


    const verbs =
        words.filter(
            (word) =>
                word.category === "verbs",
        );


    const adjectives =
        words.filter(
            (word) =>
                word.category ===
                "adjectives",
        );


    const adverbs =
        words.filter(
            (word) =>
                word.category ===
                "adverbs",
        );


    return (
        <main className="grammar-page">
            <h2 className="grammar-page-title">
                Грамматика
            </h2>


            <div className="grammar-page-toolbar">
                <p>
                    Выбрано слов:{" "}
                    <strong>
                        {count}
                    </strong>
                </p>

                {count > 0 && (
                    <button
                        type="button"
                        className="grammar-clear-btn"
                        onClick={
                            handleClearGrammar
                        }
                    >
                        Очистить всё
                    </button>
                )}
            </div>


            {count === 0 && (
                <div className="grammar-empty">
                    <h3>
                        Пока ничего не выбрано
                    </h3>

                    <p>
                        Добавьте слова с карточек,
                        чтобы увидеть здесь их
                        грамматический разбор.
                    </p>
                </div>
            )}


            {verbs.length > 0 && (
                <section className="grammar-category-section">
                    <h3 className="grammar-category-title">
                        Глаголы
                    </h3>

                    <div className="grammar-words-list">
                        {verbs.map((word) => {
                            const grammar =
                                getVerbGrammar(
                                    word.id,
                                );

                            if (!grammar) {
                                return null;
                            }


                            const key =
                                getWordKey(word);


                            return (
                                <GrammarCard
                                    key={key}
                                    title={
                                        grammar.base
                                            .infinitive
                                    }
                                    translation={
                                        grammar.base
                                            .translation
                                    }
                                    level={
                                        grammar.base
                                            .level
                                    }
                                    expanded={
                                        expandedWords.has(
                                            key,
                                        )
                                    }
                                    onToggle={() =>
                                        toggleWord(
                                            word,
                                        )
                                    }
                                    onRemove={() =>
                                        removeWord(
                                            word,
                                        )
                                    }
                                >
                                    <VerbDetails
                                        grammar={
                                            grammar
                                        }
                                    />
                                </GrammarCard>
                            );
                        })}
                    </div>
                </section>
            )}


            {adjectives.length > 0 && (
                <section className="grammar-category-section">
                    <h3 className="grammar-category-title">
                        Прилагательные
                    </h3>

                    <div className="grammar-words-list">
                        {adjectives.map(
                            (word) => {
                                const grammar =
                                    getAdjectiveGrammar(
                                        word.id,
                                    );

                                if (!grammar) {
                                    return null;
                                }


                                const key =
                                    getWordKey(
                                        word,
                                    );


                                return (
                                    <GrammarCard
                                        key={key}
                                        title={
                                            grammar
                                                .base
                                                .masculine_singular
                                        }
                                        translation={
                                            grammar
                                                .base
                                                .translation
                                        }
                                        level={
                                            grammar
                                                .base
                                                .level
                                        }
                                        expanded={
                                            expandedWords.has(
                                                key,
                                            )
                                        }
                                        onToggle={() =>
                                            toggleWord(
                                                word,
                                            )
                                        }
                                        onRemove={() =>
                                            removeWord(
                                                word,
                                            )
                                        }
                                    >
                                        <AdjectiveDetails
                                            grammar={
                                                grammar
                                            }
                                        />
                                    </GrammarCard>
                                );
                            },
                        )}
                    </div>
                </section>
            )}


            {adverbs.length > 0 && (
                <section className="grammar-category-section">
                    <h3 className="grammar-category-title">
                        Наречия
                    </h3>

                    <div className="grammar-words-list">
                        {adverbs.map((word) => {
                            const grammar =
                                getAdverbGrammar(
                                    word.id,
                                );

                            if (!grammar) {
                                return null;
                            }


                            const key =
                                getWordKey(word);


                            return (
                                <GrammarCard
                                    key={key}
                                    title={
                                        grammar.base
                                            .adverb
                                    }
                                    translation={
                                        grammar.base
                                            .translation
                                    }
                                    level={
                                        grammar.base
                                            .level
                                    }
                                    expanded={
                                        expandedWords.has(
                                            key,
                                        )
                                    }
                                    onToggle={() =>
                                        toggleWord(
                                            word,
                                        )
                                    }
                                    onRemove={() =>
                                        removeWord(
                                            word,
                                        )
                                    }
                                >
                                    <AdverbDetails
                                        grammar={
                                            grammar
                                        }
                                    />
                                </GrammarCard>
                            );
                        })}
                    </div>
                </section>
            )}
        </main>
    );
}


export default Grammar;