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
}

function shuffleArray<T>(array: T[]): T[] {
    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

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
    const wrongAnswers = words
        .filter((word) => word.hebrew !== currentWord.hebrew)
        .map((word) => word.russian);

    return shuffleArray([
        currentWord.russian,
        ...shuffleArray(wrongAnswers).slice(0, 3),
    ]);
}

function saveStatistics(
    category: Category,
    level: number,
    attempt: TestAttempt,
): void {
    const savedStats = localStorage.getItem("testStats");

    const stats: TestStats = savedStats
        ? JSON.parse(savedStats)
        : {};

    stats[category] ??= {};
    stats[category]![level] ??= [];

    stats[category]![level]!.push(attempt);

    localStorage.setItem(
        "testStats",
        JSON.stringify(stats),
    );

    window.dispatchEvent(new Event("levelsUpdated"));
}

export function Test({
                         words,
                         category,
                         level,
                     }: TestProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [selectedAnswer, setSelectedAnswer] =
        useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(15);
    const [isTimeout, setIsTimeout] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const currentWord = words[currentIndex];

    const [answers, setAnswers] = useState<string[]>(() => {
        const firstWord = words[0];

        return firstWord
            ? generateAnswers(words, firstWord)
            : [];
    });

    const finishTest = (correct: number) => {
        const percent =
            words.length > 0
                ? Math.round((correct / words.length) * 100)
                : 0;

        const attempt: TestAttempt = {
            percent,
            correct,
            total: words.length,
            date: new Date().toISOString(),
        };

        saveStatistics(category, level, attempt);
        setIsFinished(true);
    };

    const goToNextQuestion = () => {
        const nextIndex = currentIndex + 1;
        const nextWord = words[nextIndex];

        if (!nextWord) {
            finishTest(correctAnswers);
            return;
        }

        setAnswers(generateAnswers(words, nextWord));
        setSelectedAnswer(null);
        setIsTimeout(false);
        setTimeLeft(15);
        setCurrentIndex(nextIndex);
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

        const timerId = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerId);
                    setIsTimeout(true);
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, [
        currentIndex,
        selectedAnswer,
        isTimeout,
        isFinished,
    ]);

    if (isFinished) {
        const percent =
            words.length > 0
                ? Math.round(
                    (correctAnswers / words.length) * 100,
                )
                : 0;

        return (
            <div className="test-area">
                <h2>Тест завершён</h2>

                <p>
                    Правильных ответов:{" "}
                    {correctAnswers} из {words.length}
                </p>

                <p>
                    Результат: {percent}%
                </p>
            </div>
        );
    }

    if (!currentWord) {
        return <p>Нет слов для тестирования</p>;
    }

    const checkAnswer = (answer: string) => {
        if (selectedAnswer !== null || isTimeout) {
            return;
        }

        setSelectedAnswer(answer);

        if (answer === currentWord.russian) {
            setCorrectAnswers((prev) => prev + 1);
        }
    };

    const handleContinue = () => {
        const nextIndex = currentIndex + 1;

        if (!words[nextIndex]) {
            finishTest(correctAnswers);
            return;
        }

        goToNextQuestion();
    };

    const getAnswerClass = (answer: string): string => {
        if (selectedAnswer === null && !isTimeout) {
            return "styled-btn answer-btn";
        }

        if (answer === currentWord.russian) {
            return "styled-btn answer-btn correct-answer";
        }

        if (answer === selectedAnswer) {
            return "styled-btn answer-btn wrong-answer";
        }

        return "styled-btn answer-btn";
    };

    const answered =
        selectedAnswer !== null || isTimeout;

    const isCorrect =
        selectedAnswer === currentWord.russian;

    const progress =
        words.length > 0
            ? ((currentIndex + 1) / words.length) * 100
            : 0;

    return (
        <div className="test-area">
            <p>
                Вопрос {currentIndex + 1} из {words.length}
            </p>

            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="timer">
                ⌛ {timeLeft}
            </div>

            <h3 className="test-word">
                {currentWord.hebrew}
            </h3>

            <div className="answers-container">
                {answers.map((answer) => (
                    <button
                        key={answer}
                        type="button"
                        className={getAnswerClass(answer)}
                        onClick={() => checkAnswer(answer)}
                        disabled={answered}
                    >
                        {answer}
                    </button>
                ))}
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
                            {currentWord.russian}
                        </p>
                    )}

                    <button
                        type="button"
                        className="styled-btn continue-btn"
                        onClick={handleContinue}
                    >
                        Продолжить →
                    </button>
                </div>
            )}
        </div>
    );
}