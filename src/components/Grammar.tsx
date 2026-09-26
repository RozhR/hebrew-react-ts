import { useState } from "react";
import { Link } from "react-router-dom";

import GrammarCard from "./grammar/GrammarCard";
import { AdjectiveDetails, AdverbDetails, VerbDetails } from "./grammar/GrammarDetails";

import { useGrammar } from "../context/GrammarContext";
import { getAdjectiveGrammar, getAdverbGrammar, getVerbGrammar } from "../utils/grammarData";

import type { GrammarWordRef } from "../types/grammar";

function getWordKey(word: GrammarWordRef): string {
    return `${word.category}-${word.id}`;
}

function Grammar() {
    const { words, count, removeWord, clearGrammar } = useGrammar();

    const [expandedWords, setExpandedWords] = useState<Set<string>>(new Set());

    const toggleWord = (word: GrammarWordRef) => {
        const key = getWordKey(word);

        setExpandedWords((current) => {
            const next = new Set(current);

            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }

            return next;
        });
    };

    const handleClearGrammar = () => {
        const confirmed = window.confirm("Удалить все выбранные слова из грамматики?");

        if (!confirmed) {
            return;
        }

        clearGrammar();
        setExpandedWords(new Set());
    };

    const verbs = words.filter((word) => word.category === "verbs");

    const adjectives = words.filter((word) => word.category === "adjectives");

    const adverbs = words.filter((word) => word.category === "adverbs");

    return (
        <main className="grammar-page">
            <h2 className="grammar-page-title">Грамматика</h2>

            <div className="grammar-page-toolbar">
                <p>
                    Выбрано слов: <strong>{count}</strong>
                </p>

                <div className="grammar-page-toolbar-actions">
                    {verbs.length > 0 && (
                        <Link to="/grammar/test" className="grammar-test-btn">
                            Тест по глаголам
                        </Link>
                    )}

                    {count > 0 && (
                        <button
                            type="button"
                            className="grammar-clear-btn"
                            onClick={handleClearGrammar}
                        >
                            Очистить всё
                        </button>
                    )}
                </div>
            </div>

            {count === 0 && (
                <div className="grammar-empty">
                    <h3>Пока ничего не выбрано</h3>

                    <p>Добавьте слова с карточек, чтобы увидеть здесь их грамматический разбор.</p>
                </div>
            )}

            {verbs.length > 0 && (
                <section className="grammar-category-section">
                    <h3 className="grammar-category-title">Глаголы</h3>

                    <div className="grammar-words-list">
                        {verbs.map((word) => {
                            const grammar = getVerbGrammar(word.id);

                            if (!grammar) {
                                return null;
                            }

                            const key = getWordKey(word);

                            return (
                                <GrammarCard
                                    key={key}
                                    title={grammar.base.infinitive}
                                    translation={grammar.base.translation}
                                    level={grammar.base.level}
                                    expanded={expandedWords.has(key)}
                                    onToggle={() => toggleWord(word)}
                                    onRemove={() => removeWord(word)}
                                >
                                    <VerbDetails grammar={grammar} />
                                </GrammarCard>
                            );
                        })}
                    </div>
                </section>
            )}

            {adjectives.length > 0 && (
                <section className="grammar-category-section">
                    <h3 className="grammar-category-title">Прилагательные</h3>

                    <div className="grammar-words-list">
                        {adjectives.map((word) => {
                            const grammar = getAdjectiveGrammar(word.id);

                            if (!grammar) {
                                return null;
                            }

                            const key = getWordKey(word);

                            return (
                                <GrammarCard
                                    key={key}
                                    title={grammar.base.masculine_singular}
                                    translation={grammar.base.translation}
                                    level={grammar.base.level}
                                    expanded={expandedWords.has(key)}
                                    onToggle={() => toggleWord(word)}
                                    onRemove={() => removeWord(word)}
                                >
                                    <AdjectiveDetails grammar={grammar} />
                                </GrammarCard>
                            );
                        })}
                    </div>
                </section>
            )}

            {adverbs.length > 0 && (
                <section className="grammar-category-section">
                    <h3 className="grammar-category-title">Наречия</h3>

                    <div className="grammar-words-list">
                        {adverbs.map((word) => {
                            const grammar = getAdverbGrammar(word.id);

                            if (!grammar) {
                                return null;
                            }

                            const key = getWordKey(word);

                            return (
                                <GrammarCard
                                    key={key}
                                    title={grammar.base.adverb}
                                    translation={grammar.base.translation}
                                    level={grammar.base.level}
                                    expanded={expandedWords.has(key)}
                                    onToggle={() => toggleWord(word)}
                                    onRemove={() => removeWord(word)}
                                >
                                    <AdverbDetails grammar={grammar} />
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
