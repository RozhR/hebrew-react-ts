import VerbTenseTable from "./VerbTenseTable";

import type { AdjectiveGrammar, AdverbGrammar, VerbGrammar } from "../../types/grammar";

type FormItem = {
    label: string;
    value: string;
};

function GrammarForms({ title, items }: { title: string; items: FormItem[] }) {
    return (
        <section className="grammar-detail-section">
            <h4>{title}</h4>

            <div className="grammar-forms-grid">
                {items.map((item) => (
                    <div className="grammar-form-item" key={item.label}>
                        <span className="grammar-form-label">{item.label}</span>

                        <strong dir="rtl">{item.value}</strong>
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
            <span>{label}</span>

            <strong dir={hebrew ? "rtl" : undefined}>{value}</strong>
        </div>
    );
}

function GrammarExample({ hebrew, translation }: { hebrew: string; translation: string }) {
    return (
        <div className="grammar-example">
            <p className="grammar-example-hebrew" dir="rtl">
                {hebrew}
            </p>

            <p className="grammar-example-translation">{translation}</p>
        </div>
    );
}

export function VerbDetails({ grammar }: { grammar: VerbGrammar }) {
    return (
        <>
            <section className="grammar-detail-section">
                <h4>Основная информация</h4>

                <div className="grammar-info-grid">
                    <GrammarInfo label="Биньян" value={grammar.present.binyan} />

                    <GrammarInfo
                        label="Управление / предлог"
                        value={grammar.base.government}
                        hebrew
                    />
                </div>
            </section>

            <GrammarForms
                title="Настоящее время"
                items={[
                    {
                        label: "м. ед.",
                        value: grammar.present.masculine_singular,
                    },
                    {
                        label: "ж. ед.",
                        value: grammar.present.feminine_singular,
                    },
                    {
                        label: "м. мн.",
                        value: grammar.present.masculine_plural,
                    },
                    {
                        label: "ж. мн.",
                        value: grammar.present.feminine_plural,
                    },
                ]}
            />

            <VerbTenseTable grammar={grammar} />

            <GrammarForms
                title="Повелительное наклонение"
                items={[
                    {
                        label: "м. ед.",
                        value: grammar.future.imperative_masculine,
                    },
                    {
                        label: "ж. ед.",
                        value: grammar.future.imperative_feminine,
                    },
                    {
                        label: "мн.",
                        value: grammar.future.imperative_plural,
                    },
                ]}
            />

            <section className="grammar-detail-section">
                <h4>Примеры</h4>

                <div className="grammar-examples">
                    <GrammarExample
                        hebrew={grammar.examples.present_example}
                        translation={grammar.examples.present_translation}
                    />

                    <GrammarExample
                        hebrew={grammar.examples.past_example}
                        translation={grammar.examples.past_translation}
                    />

                    <GrammarExample
                        hebrew={grammar.examples.future_example}
                        translation={grammar.examples.future_translation}
                    />
                </div>
            </section>
        </>
    );
}

export function AdjectiveDetails({ grammar }: { grammar: AdjectiveGrammar }) {
    return (
        <>
            <GrammarForms
                title="Формы"
                items={[
                    {
                        label: "м. ед.",
                        value: grammar.base.masculine_singular,
                    },
                    {
                        label: "ж. ед.",
                        value: grammar.base.feminine_singular,
                    },
                    {
                        label: "м. мн.",
                        value: grammar.base.masculine_plural,
                    },
                    {
                        label: "ж. мн.",
                        value: grammar.base.feminine_plural,
                    },
                ]}
            />

            {grammar.construction && (
                <section className="grammar-detail-section">
                    <h4>Управление и конструкции</h4>

                    <div className="grammar-info-grid">
                        <GrammarInfo
                            label="Конструкция"
                            value={grammar.construction.construction}
                            hebrew
                        />

                        <GrammarInfo label="Значение" value={grammar.construction.meaning} />
                    </div>
                </section>
            )}

            <section className="grammar-detail-section">
                <h4>Примеры</h4>

                <div className="grammar-examples">
                    <GrammarExample
                        hebrew={grammar.examples.example1}
                        translation={grammar.examples.translation1}
                    />

                    <GrammarExample
                        hebrew={grammar.examples.example2}
                        translation={grammar.examples.translation2}
                    />

                    <GrammarExample
                        hebrew={grammar.examples.example3}
                        translation={grammar.examples.translation3}
                    />
                </div>
            </section>
        </>
    );
}

export function AdverbDetails({ grammar }: { grammar: AdverbGrammar }) {
    return (
        <>
            <section className="grammar-detail-section">
                <h4>Употребление</h4>

                <div className="grammar-info-grid">
                    <GrammarInfo label="Значение" value={grammar.usage.main_meaning} />

                    <GrammarInfo label="Категория" value={grammar.usage.category} />

                    <GrammarInfo label="Регистр" value={grammar.usage.register} />
                </div>

                <p className="grammar-usage-text">{grammar.usage.usage}</p>
            </section>

            {grammar.relation && (
                <section className="grammar-detail-section">
                    <h4>Связанные слова</h4>

                    <div className="grammar-info-grid">
                        <GrammarInfo label="Синоним" value={grammar.relation.synonym} hebrew />

                        <GrammarInfo label="Антоним" value={grammar.relation.antonym} hebrew />

                        <GrammarInfo
                            label="Выражение"
                            value={grammar.relation.related_expression}
                            hebrew
                        />
                    </div>

                    <p className="grammar-usage-text">{grammar.relation.comment}</p>
                </section>
            )}

            <section className="grammar-detail-section">
                <h4>Примеры</h4>

                <div className="grammar-examples">
                    <GrammarExample
                        hebrew={grammar.examples.example1}
                        translation={grammar.examples.translation1}
                    />

                    <GrammarExample
                        hebrew={grammar.examples.example2}
                        translation={grammar.examples.translation2}
                    />

                    <GrammarExample
                        hebrew={grammar.examples.example3}
                        translation={grammar.examples.translation3}
                    />
                </div>
            </section>
        </>
    );
}
