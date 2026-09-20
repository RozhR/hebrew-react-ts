import { useEffect, useState } from "react";

import type {
    CardData,
    Category,
    TestAttempt,
    TestStats,
} from "../types";

interface TestProps {
    words: CardData[];
    category: Category;
    level: number;
    isLastLevel: boolean;
    onBackToCards: () => void;
}

function shuffleArray<T>(array: T[]): T[] {
    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(
            Math.random() * (i + 1),
        );

        [result[i], result[j]] = [
            result[j],
            result[i],
        ];
    }

    return result;
}

function generateAnswers(
    words: CardData[],
    currentWord: CardData,
): string[] {
    const wrongAnswers = Array.from(
        new Set(
            words
                .filter(
                    (word) =>
                        word.hebrew !==
                        currentWord.hebrew &&
                        word.russian !==
                        currentWord.russian,
                )
                .map(
                    (word) =>
                        word.russian,
                ),
        ),
    );

    return shuffleArray([
        currentWord.russian,
        ...shuffleArray(
            wrongAnswers,
        ).slice(0, 3),
    ]);
}

function saveStatistics(
    category: Category,
    level: number,
    attempt: TestAttempt,
): void {
    const savedStats =
        localStorage.getItem("testStats");

    const stats: TestStats = (() => {
        try {
            return savedStats
                ? JSON.parse(savedStats)
                : {};
        } catch {
            return {};
        }
    })();

    stats[category] ??= {};
    stats[category]![level] ??= [];

    stats[category]![level]!.push(attempt);

    localStorage.setItem(
        "testStats",
        JSON.stringify(stats),
    );

    window.dispatchEvent(
        new Event("levelsUpdated"),
    );
}

export function Test({
                         words,
                         category,
                         level,
                         isLastLevel,
                         onBackToCards,
                     }: TestProps) {
    const [testWords, setTestWords] =
        useState<CardData[]>(() =>
            shuffleArray(words),
        );

    const [currentIndex, setCurrentIndex] =
        useState(0);

    const [
        correctAnswers,
        setCorrectAnswers,
    ] = useState(0);

    const [
        selectedAnswer,
        setSelectedAnswer,
    ] = useState<string | null>(null);

    const [timeLeft, setTimeLeft] =
        useState(15);

    const [isTimeout, setIsTimeout] =
        useState(false);

    const [isFinished, setIsFinished] =
        useState(false);

    const currentWord =
        testWords[currentIndex];

    const [answers, setAnswers] =
        useState<string[]>(() => {
            const firstWord =
                testWords[0];

            return firstWord
                ? generateAnswers(
                    testWords,
                    firstWord,
                )
                : [];
        });

    const finishTest = (
        finalCorrectAnswers: number,
    ) => {
        const percent =
            testWords.length > 0
                ? Math.round(
                    (finalCorrectAnswers /
                        testWords.length) *
                    100,
                )
                : 0;

        const attempt: TestAttempt = {
            percent,
            correct: finalCorrectAnswers,
            total: testWords.length,
            date: new Date().toISOString(),
        };

        saveStatistics(
            category,
            level,
            attempt,
        );

        setIsFinished(true);
    };

    const restartTest = () => {
        const shuffledWords =
            shuffleArray(words);

        setTestWords(shuffledWords);

        setCurrentIndex(0);
        setCorrectAnswers(0);
        setSelectedAnswer(null);
        setTimeLeft(15);
        setIsTimeout(false);
        setIsFinished(false);

        const firstWord =
            shuffledWords[0];

        setAnswers(
            firstWord
                ? generateAnswers(
                    shuffledWords,
                    firstWord,
                )
                : [],
        );
    };

    useEffect(() => {
        if (
            !currentWord ||
            selectedAnswer !== null ||
            isTimeout ||
            isFinished
        ) {
            return;
        }

        const timerId =
            window.setInterval(() => {
                setTimeLeft(
                    (previousTime) => {
                        if (
                            previousTime <= 1
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
                            previousTime - 1
                        );
                    },
                );
            }, 1000);

        return () => {
            window.clearInterval(timerId);
        };
    }, [
        currentWord,
        selectedAnswer,
        isTimeout,
        isFinished,
    ]);

    if (
        !currentWord &&
        !isFinished
    ) {
        return (
            <div className="test-area">
                <p>
                    Нет слов для тестирования
                </p>
            </div>
        );
    }

    if (isFinished) {
        const percent =
            testWords.length > 0
                ? Math.round(
                    (correctAnswers /
                        testWords.length) *
                    100,
                )
                : 0;

        const passed =
            percent >= 85;

        return (
            <div className="test-area">
                <div className="test-result-card">
                    <h3 className="test-result-title">
                        Тест завершён
                    </h3>

                    <div
                        className={
                            passed
                                ? "test-result-percent passed"
                                : "test-result-percent failed"
                        }
                    >
                        {percent}%
                    </div>

                    <p className="test-result-text">
                        Правильных ответов:{" "}
                        <strong>
                            {correctAnswers}
                        </strong>{" "}
                        из{" "}
                        <strong>
                            {testWords.length}
                        </strong>
                    </p>

                    {passed ? (
                        <p className="test-result-message passed-message">
                            {isLastLevel
                                ? "Отличный результат! Вы завершили все уровни этой категории."
                                : "Отличный результат! Следующий уровень разблокирован."}
                        </p>
                    ) : (
                        <p className="test-result-message failed-message">
                            Для открытия
                            следующего уровня
                            необходимо набрать
                            минимум 85%.
                        </p>
                    )}

                    <div className="test-result-actions">
                        <button
                            type="button"
                            className="styled-btn"
                            onClick={
                                restartTest
                            }
                        >
                            Пройти ещё раз
                        </button>

                        <button
                            type="button"
                            className="styled-btn"
                            onClick={
                                onBackToCards
                            }
                        >
                            Вернуться к карточкам
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const checkAnswer = (
        answer: string,
    ) => {
        if (
            selectedAnswer !== null ||
            isTimeout
        ) {
            return;
        }

        setSelectedAnswer(answer);

        if (
            answer ===
            currentWord.russian
        ) {
            setCorrectAnswers(
                (previous) =>
                    previous + 1,
            );
        }
    };

    const handleContinue = () => {
        const nextIndex =
            currentIndex + 1;

        const nextWord =
            testWords[nextIndex];

        if (!nextWord) {
            finishTest(
                correctAnswers,
            );
            return;
        }

        setCurrentIndex(
            nextIndex,
        );

        setAnswers(
            generateAnswers(
                testWords,
                nextWord,
            ),
        );

        setSelectedAnswer(null);
        setIsTimeout(false);
        setTimeLeft(15);
    };

    const answered =
        selectedAnswer !== null ||
        isTimeout;

    const isCorrect =
        selectedAnswer ===
        currentWord.russian;

    const getAnswerClass = (
        answer: string,
    ): string => {
        if (!answered) {
            return "styled-btn answer-btn";
        }

        if (
            answer ===
            currentWord.russian
        ) {
            return "styled-btn answer-btn correct-answer";
        }

        if (
            answer ===
            selectedAnswer
        ) {
            return "styled-btn answer-btn wrong-answer";
        }

        return "styled-btn answer-btn";
    };

    const progress =
        testWords.length > 0
            ? ((currentIndex + 1) /
                testWords.length) *
            100
            : 0;

    return (
        <div className="test-area">
            <p className="question-number">
                Вопрос {currentIndex + 1}{" "}
                из {testWords.length}
            </p>

            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{
                        width: `${progress}%`,
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

            <h3 className="test-word">
                {currentWord.hebrew}
            </h3>

            <div className="answers-container">
                {answers.map(
                    (answer) => (
                        <button
                            key={answer}
                            type="button"
                            className={getAnswerClass(
                                answer,
                            )}
                            onClick={() =>
                                checkAnswer(
                                    answer,
                                )
                            }
                            disabled={
                                answered
                            }
                        >
                            {answer}
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

                    {!isCorrect && (
                        <p className="correct-answer-text">
                            Правильный ответ:{" "}
                            <strong>
                                {
                                    currentWord.russian
                                }
                            </strong>
                        </p>
                    )}

                    <button
                        type="button"
                        className="styled-btn continue-btn"
                        onClick={
                            handleContinue
                        }
                    >
                        Продолжить →
                    </button>
                </div>
            )}
        </div>
    );
}