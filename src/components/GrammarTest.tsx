import {
    useEffect,
    useMemo,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { useGrammar } from "../context/GrammarContext";

import { getVerbGrammar } from "../utils/grammarData";

import type { VerbGrammar } from "../types/grammar";


type GrammarTestSection =
    | "present"
    | "past"
    | "future"
    | "imperative";


type GrammarQuestion = {
    id: string;

    infinitive: string;
    translation: string;

    section: GrammarTestSection;

    sectionTitle: string;
    person: string;

    correctAnswer: string;
    answers: string[];
};


type GrammarTestAttempt = {
    percent: number;
    correct: number;
    total: number;
    date: string;
    sections: GrammarTestSection[];
};


const TIMER_SECONDS = 15;


const sectionTitles:
    Record<GrammarTestSection, string> = {
    present: "Настоящее время",
    past: "Прошедшее время",
    future: "Будущее время",
    imperative: "Повелительное наклонение",
};


function shuffleArray<T>(
    array: T[],
): T[] {
    const result = [...array];

    for (
        let i = result.length - 1;
        i > 0;
        i--
    ) {
        const j = Math.floor(
            Math.random() * (i + 1),
        );

        [
            result[i],
            result[j],
        ] = [
            result[j],
            result[i],
        ];
    }

    return result;
}


function isValidForm(
    value: string,
): boolean {
    return (
        value.trim() !== "" &&
        value.trim() !== "—"
    );
}


function getPresentForms(
    grammar: VerbGrammar,
) {
    return [
        {
            person: "הוא",
            value:
            grammar.present
                .masculine_singular,
        },
        {
            person: "היא",
            value:
            grammar.present
                .feminine_singular,
        },
        {
            person: "הם",
            value:
            grammar.present
                .masculine_plural,
        },
        {
            person: "הן",
            value:
            grammar.present
                .feminine_plural,
        },
    ];
}


function getPastForms(
    grammar: VerbGrammar,
) {
    return [
        {
            person: "אני",
            value:
            grammar.past
                .first_person_singular,
        },
        {
            person: "אתה",
            value:
            grammar.past
                .second_person_masculine_singular,
        },
        {
            person: "את",
            value:
            grammar.past
                .second_person_feminine_singular,
        },
        {
            person: "הוא",
            value:
            grammar.past
                .third_person_masculine_singular,
        },
        {
            person: "היא",
            value:
            grammar.past
                .third_person_feminine_singular,
        },
        {
            person: "אנחנו",
            value:
            grammar.past
                .first_person_plural,
        },
        {
            person: "אתם",
            value:
            grammar.past
                .second_person_masculine_plural,
        },
        {
            person: "אתן",
            value:
            grammar.past
                .second_person_feminine_plural,
        },
        {
            person: "הם / הן",
            value:
            grammar.past
                .third_person_plural,
        },
    ];
}


function getFutureForms(
    grammar: VerbGrammar,
) {
    return [
        {
            person: "אני",
            value:
            grammar.future
                .first_person_singular,
        },
        {
            person: "אתה",
            value:
            grammar.future
                .second_person_masculine_singular,
        },
        {
            person: "את",
            value:
            grammar.future
                .second_person_feminine_singular,
        },
        {
            person: "הוא",
            value:
            grammar.future
                .third_person_masculine_singular,
        },
        {
            person: "היא",
            value:
            grammar.future
                .third_person_feminine_singular,
        },
        {
            person: "אנחנו",
            value:
            grammar.future
                .first_person_plural,
        },
        {
            person: "אתם",
            value:
            grammar.future
                .second_person_masculine_plural,
        },
        {
            person: "אתן",
            value:
            grammar.future
                .second_person_feminine_plural,
        },
        {
            person: "הם / הן",
            value:
            grammar.future
                .third_person_plural,
        },
    ];
}


function getImperativeForms(
    grammar: VerbGrammar,
) {
    return [
        {
            person: "אתה",
            value:
            grammar.future
                .imperative_masculine,
        },
        {
            person: "את",
            value:
            grammar.future
                .imperative_feminine,
        },
        {
            person: "אתם / אתן",
            value:
            grammar.future
                .imperative_plural,
        },
    ];
}


function getSectionForms(
    grammar: VerbGrammar,
    section: GrammarTestSection,
) {
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


function getAllForms(
    grammar: VerbGrammar,
): string[] {
    return [
        ...getPresentForms(grammar),
        ...getPastForms(grammar),
        ...getFutureForms(grammar),
        ...getImperativeForms(grammar),
    ]
        .map((item) => item.value)
        .filter(isValidForm);
}


function createQuestions(
    grammars: VerbGrammar[],
    sections: GrammarTestSection[],
): GrammarQuestion[] {
    const questions:
        GrammarQuestion[] = [];

    grammars.forEach((grammar) => {
        /*
         * Все формы только текущего глагола.
         *
         * Они используются как резерв,
         * если в текущем времени недостаточно
         * уникальных неправильных вариантов.
         */
        const allCurrentVerbForms =
            Array.from(
                new Set(
                    getAllForms(grammar),
                ),
            );

        sections.forEach((section) => {
            const forms =
                getSectionForms(
                    grammar,
                    section,
                );

            /*
             * Формы только текущего глагола
             * и только текущего времени /
             * грамматического раздела.
             */
            const sameSectionForms =
                Array.from(
                    new Set(
                        forms
                            .map(
                                (item) =>
                                    item.value,
                            )
                            .filter(
                                isValidForm,
                            ),
                    ),
                );

            forms.forEach(
                (
                    form,
                    index,
                ) => {
                    if (
                        !isValidForm(
                            form.value,
                        )
                    ) {
                        return;
                    }

                    /*
                     * Приоритет:
                     *
                     * 1. Другие формы этого же глагола
                     *    в том же времени.
                     *
                     * 2. Если их недостаточно —
                     *    другие времена этого же глагола.
                     *
                     * Формы других выбранных глаголов
                     * никогда не используются.
                     */
                    const wrongCandidates =
                        Array.from(
                            new Set([
                                ...sameSectionForms,
                                ...allCurrentVerbForms,
                            ]),
                        ).filter(
                            (value) =>
                                value !==
                                form.value,
                        );

                    /*
                     * Для четырёх вариантов ответа
                     * нужны минимум три неправильные
                     * уникальные формы.
                     */
                    if (
                        wrongCandidates.length <
                        3
                    ) {
                        return;
                    }

                    const wrongAnswers =
                        shuffleArray(
                            wrongCandidates,
                        ).slice(0, 3);

                    const answers =
                        shuffleArray([
                            form.value,
                            ...wrongAnswers,
                        ]);

                    questions.push({
                        id:
                            `${grammar.base.id}-${section}-${index}`,

                        infinitive:
                        grammar.base
                            .infinitive,

                        translation:
                        grammar.base
                            .translation,

                        section,

                        sectionTitle:
                            sectionTitles[
                                section
                                ],

                        person:
                        form.person,

                        correctAnswer:
                        form.value,

                        answers,
                    });
                },
            );
        });
    });

    return shuffleArray(
        questions,
    );
}

function saveGrammarTestAttempt(
    attempt: GrammarTestAttempt,
) {
    const key =
        "grammarTestStats";

    try {
        const saved =
            localStorage.getItem(
                key,
            );

        const attempts:
            GrammarTestAttempt[] =
            saved
                ? JSON.parse(saved)
                : [];

        attempts.push(attempt);

        localStorage.setItem(
            key,
            JSON.stringify(
                attempts,
            ),
        );
    } catch {
        localStorage.setItem(
            key,
            JSON.stringify([
                attempt,
            ]),
        );
    }
}


function GrammarTest() {
    const navigate =
        useNavigate();

    const { words } =
        useGrammar();


    const verbGrammars =
        useMemo(
            () =>
                words
                    .filter(
                        (word) =>
                            word.category ===
                            "verbs",
                    )
                    .map(
                        (word) =>
                            getVerbGrammar(
                                word.id,
                            ),
                    )
                    .filter(
                        (
                            grammar,
                        ): grammar is VerbGrammar =>
                            grammar !==
                            undefined,
                    ),
            [words],
        );


    const [
        selectedSections,
        setSelectedSections,
    ] = useState<
        GrammarTestSection[]
    >([
        "present",
        "past",
        "future",
    ]);


    const [
        questionLimit,
        setQuestionLimit,
    ] = useState<
        "10" | "20" | "all"
    >("10");


    const [
        questions,
        setQuestions,
    ] = useState<
        GrammarQuestion[]
    >([]);


    const [
        currentIndex,
        setCurrentIndex,
    ] = useState(0);


    const [
        correctAnswers,
        setCorrectAnswers,
    ] = useState(0);


    const [
        selectedAnswer,
        setSelectedAnswer,
    ] = useState<
        string | null
    >(null);


    const [
        timeLeft,
        setTimeLeft,
    ] = useState(
        TIMER_SECONDS,
    );


    const [
        isTimeout,
        setIsTimeout,
    ] = useState(false);


    const [
        isStarted,
        setIsStarted,
    ] = useState(false);


    const [
        isFinished,
        setIsFinished,
    ] = useState(false);


    const currentQuestion =
        questions[
            currentIndex
            ];


    const toggleSection = (
        section:
        GrammarTestSection,
    ) => {
        setSelectedSections(
            (current) => {
                if (
                    current.includes(
                        section,
                    )
                ) {
                    return current.filter(
                        (item) =>
                            item !==
                            section,
                    );
                }

                return [
                    ...current,
                    section,
                ];
            },
        );
    };


    const startTest = () => {
        if (
            selectedSections.length ===
            0
        ) {
            return;
        }


        const allQuestions =
            createQuestions(
                verbGrammars,
                selectedSections,
            );


        const limit =
            questionLimit === "all"
                ? allQuestions.length
                : Number(
                    questionLimit,
                );


        const nextQuestions =
            allQuestions.slice(
                0,
                limit,
            );


        setQuestions(
            nextQuestions,
        );

        setCurrentIndex(0);
        setCorrectAnswers(0);

        setSelectedAnswer(
            null,
        );

        setTimeLeft(
            TIMER_SECONDS,
        );

        setIsTimeout(false);
        setIsFinished(false);
        setIsStarted(true);
    };


    useEffect(() => {
        if (
            !isStarted ||
            isFinished ||
            !currentQuestion ||
            selectedAnswer !== null ||
            isTimeout
        ) {
            return;
        }


        const timerId =
            window.setInterval(
                () => {
                    setTimeLeft(
                        (
                            previous,
                        ) => {
                            if (
                                previous <=
                                1
                            ) {
                                window.clearInterval(
                                    timerId,
                                );

                                setIsTimeout(
                                    true,
                                );

                                return 0;
                            }

                            return (
                                previous -
                                1
                            );
                        },
                    );
                },
                1000,
            );


        return () => {
            window.clearInterval(
                timerId,
            );
        };
    }, [
        isStarted,
        isFinished,
        currentQuestion,
        selectedAnswer,
        isTimeout,
    ]);


    const checkAnswer = (
        answer: string,
    ) => {
        if (
            !currentQuestion ||
            selectedAnswer !== null ||
            isTimeout
        ) {
            return;
        }


        setSelectedAnswer(
            answer,
        );


        if (
            answer ===
            currentQuestion
                .correctAnswer
        ) {
            setCorrectAnswers(
                (current) =>
                    current + 1,
            );
        }
    };


    const finishTest = () => {
        const percent =
            questions.length > 0
                ? Math.round(
                    (
                        correctAnswers /
                        questions.length
                    ) *
                    100,
                )
                : 0;


        saveGrammarTestAttempt({
            percent,
            correct:
            correctAnswers,
            total:
            questions.length,
            date:
                new Date()
                    .toISOString(),
            sections:
            selectedSections,
        });


        setIsFinished(true);
    };


    const handleContinue = () => {
        const nextIndex =
            currentIndex + 1;


        if (
            nextIndex >=
            questions.length
        ) {
            finishTest();

            return;
        }


        setCurrentIndex(
            nextIndex,
        );

        setSelectedAnswer(
            null,
        );

        setIsTimeout(false);

        setTimeLeft(
            TIMER_SECONDS,
        );
    };


    /*
     * Нет выбранных глаголов.
     */
    if (
        verbGrammars.length ===
        0
    ) {
        return (
            <main className="grammar-test-page">
                <h2 className="grammar-page-title">
                    Тест по глаголам
                </h2>

                <div className="grammar-empty">
                    <h3>
                        Нет выбранных
                        глаголов
                    </h3>

                    <p>
                        Добавьте хотя бы
                        один глагол в раздел
                        «Грамматика».
                    </p>

                    <button
                        type="button"
                        className="styled-btn"
                        onClick={() =>
                            navigate(
                                "/grammar",
                            )
                        }
                    >
                        Вернуться к грамматике
                    </button>
                </div>
            </main>
        );
    }


    /*
     * Экран настройки.
     */
    if (!isStarted) {
        return (
            <main className="grammar-test-page">
                <h2 className="grammar-page-title">
                    Тест по глаголам
                </h2>


                <div className="grammar-test-setup">
                    <p className="grammar-test-selected">
                        Выбрано глаголов:{" "}
                        <strong>
                            {
                                verbGrammars.length
                            }
                        </strong>
                    </p>


                    <h3>
                        Что тестировать
                    </h3>


                    <div className="grammar-test-sections">
                        {(
                            [
                                "present",
                                "past",
                                "future",
                                "imperative",
                            ] as GrammarTestSection[]
                        ).map(
                            (
                                section,
                            ) => (
                                <label
                                    key={
                                        section
                                    }
                                    className="grammar-test-option"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedSections.includes(
                                            section,
                                        )}
                                        onChange={() =>
                                            toggleSection(
                                                section,
                                            )
                                        }
                                    />

                                    <span>
                                        {
                                            sectionTitles[
                                                section
                                                ]
                                        }
                                    </span>
                                </label>
                            ),
                        )}
                    </div>


                    <h3>
                        Количество вопросов
                    </h3>


                    <select
                        className="grammar-test-select"
                        value={
                            questionLimit
                        }
                        onChange={(
                            event,
                        ) =>
                            setQuestionLimit(
                                event
                                    .target
                                    .value as
                                    | "10"
                                    | "20"
                                    | "all",
                            )
                        }
                    >
                        <option value="10">
                            10
                        </option>

                        <option value="20">
                            20
                        </option>

                        <option value="all">
                            Все доступные
                        </option>
                    </select>


                    <div className="grammar-test-setup-actions">
                        <button
                            type="button"
                            className="styled-btn"
                            disabled={
                                selectedSections.length ===
                                0
                            }
                            onClick={
                                startTest
                            }
                        >
                            Начать тест
                        </button>

                        <button
                            type="button"
                            className="styled-btn"
                            onClick={() =>
                                navigate(
                                    "/grammar",
                                )
                            }
                        >
                            Назад
                        </button>
                    </div>
                </div>
            </main>
        );
    }


    /*
     * Финальный экран.
     */
    if (isFinished) {
        const percent =
            questions.length > 0
                ? Math.round(
                    (
                        correctAnswers /
                        questions.length
                    ) *
                    100,
                )
                : 0;


        return (
            <main className="grammar-test-page">
                <div className="test-result-card">
                    <h3 className="test-result-title">
                        Грамматический тест
                        завершён
                    </h3>


                    <div
                        className={
                            percent >= 85
                                ? "test-result-percent passed"
                                : "test-result-percent failed"
                        }
                    >
                        {percent}%
                    </div>


                    <p className="test-result-text">
                        Правильных ответов:{" "}
                        <strong>
                            {
                                correctAnswers
                            }
                        </strong>{" "}
                        из{" "}
                        <strong>
                            {
                                questions.length
                            }
                        </strong>
                    </p>


                    <div className="test-result-actions">
                        <button
                            type="button"
                            className="styled-btn"
                            onClick={
                                startTest
                            }
                        >
                            Пройти ещё раз
                        </button>

                        <button
                            type="button"
                            className="styled-btn"
                            onClick={() => {
                                setIsStarted(
                                    false,
                                );

                                setIsFinished(
                                    false,
                                );
                            }}
                        >
                            Изменить настройки
                        </button>

                        <button
                            type="button"
                            className="styled-btn"
                            onClick={() =>
                                navigate(
                                    "/grammar",
                                )
                            }
                        >
                            К грамматике
                        </button>
                    </div>
                </div>
            </main>
        );
    }


    if (!currentQuestion) {
        return (
            <main className="grammar-test-page">
                <div className="grammar-empty">
                    <h3>
                        Недостаточно форм
                        для тестирования
                    </h3>

                    <button
                        type="button"
                        className="styled-btn"
                        onClick={() =>
                            setIsStarted(
                                false,
                            )
                        }
                    >
                        Изменить настройки
                    </button>
                </div>
            </main>
        );
    }


    const answered =
        selectedAnswer !== null ||
        isTimeout;


    const isCorrect =
        selectedAnswer ===
        currentQuestion
            .correctAnswer;


    const progress =
        (
            (currentIndex + 1) /
            questions.length
        ) *
        100;


    const getAnswerClass = (
        answer: string,
    ) => {
        if (!answered) {
            return "styled-btn answer-btn grammar-answer-btn";
        }


        if (
            answer ===
            currentQuestion
                .correctAnswer
        ) {
            return "styled-btn answer-btn grammar-answer-btn correct-answer";
        }


        if (
            answer ===
            selectedAnswer
        ) {
            return "styled-btn answer-btn grammar-answer-btn wrong-answer";
        }


        return "styled-btn answer-btn grammar-answer-btn";
    };


    return (
        <main className="grammar-test-page">
            <div className="test-area">
                <p className="question-number">
                    Вопрос{" "}
                    {currentIndex + 1}{" "}
                    из{" "}
                    {questions.length}
                </p>


                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{
                            width:
                                `${progress}%`,
                        }}
                    />
                </div>


                <div
                    className={
                        timeLeft <= 5
                            ? "timer timer-warning"
                            : "timer"
                    }
                >
                    ⌛ {timeLeft}
                </div>


                <div className="grammar-test-question">
                    <h3
                        className="grammar-test-infinitive"
                        dir="rtl"
                    >
                        {
                            currentQuestion
                                .infinitive
                        }
                    </h3>

                    <p className="grammar-test-translation">
                        {
                            currentQuestion
                                .translation
                        }
                    </p>


                    <div className="grammar-test-task">
                        <span>
                            {
                                currentQuestion
                                    .sectionTitle
                            }
                        </span>

                        <strong
                            dir="rtl"
                        >
                            {
                                currentQuestion
                                    .person
                            }
                        </strong>
                    </div>
                </div>


                <div className="answers-container">
                    {currentQuestion
                        .answers
                        .map(
                            (
                                answer,
                            ) => (
                                <button
                                    key={
                                        answer
                                    }
                                    type="button"
                                    className={
                                        getAnswerClass(
                                            answer,
                                        )
                                    }
                                    disabled={
                                        answered
                                    }
                                    onClick={() =>
                                        checkAnswer(
                                            answer,
                                        )
                                    }
                                    dir="rtl"
                                >
                                    {
                                        answer
                                    }
                                </button>
                            ),
                        )}
                </div>


                {answered && (
                    <div className="answer-result">
                        {isTimeout ? (
                            <div className="wrong">
                                Время вышло!
                            </div>
                        ) : isCorrect ? (
                            <div className="correct">
                                Верно!
                            </div>
                        ) : (
                            <div className="wrong">
                                Неверно!
                            </div>
                        )}


                        <p className="correct-answer-text">
                            Правильная форма:{" "}
                            <strong
                                dir="rtl"
                            >
                                {
                                    currentQuestion
                                        .correctAnswer
                                }
                            </strong>
                        </p>


                        <button
                            type="button"
                            className="styled-btn continue-btn"
                            onClick={
                                handleContinue
                            }
                        >
                            {currentIndex + 1 ===
                            questions.length
                                ? "Завершить"
                                : "Продолжить"}
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}


export default GrammarTest;