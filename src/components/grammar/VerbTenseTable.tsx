import type { VerbGrammar } from "../../types/grammar";

const PRONOUNS = ["אני", "אתה", "את", "הוא", "היא", "אנחנו", "אתם", "אתן", "הם / הן"];

type VerbTenseTableProps = {
    grammar: VerbGrammar;
};

function VerbTenseTable({ grammar }: VerbTenseTableProps) {
    const rows = [
        {
            tense: "Прошедшее",
            forms: [
                grammar.past.first_person_singular,
                grammar.past.second_person_masculine_singular,
                grammar.past.second_person_feminine_singular,
                grammar.past.third_person_masculine_singular,
                grammar.past.third_person_feminine_singular,
                grammar.past.first_person_plural,
                grammar.past.second_person_masculine_plural,
                grammar.past.second_person_feminine_plural,
                grammar.past.third_person_plural,
            ],
        },
        {
            tense: "Будущее",
            forms: [
                grammar.future.first_person_singular,
                grammar.future.second_person_masculine_singular,
                grammar.future.second_person_feminine_singular,
                grammar.future.third_person_masculine_singular,
                grammar.future.third_person_feminine_singular,
                grammar.future.first_person_plural,
                grammar.future.second_person_masculine_plural,
                grammar.future.second_person_feminine_plural,
                grammar.future.third_person_plural,
            ],
        },
    ];

    return (
        <section className="grammar-detail-section">
            <h4>Прошедшее и будущее время</h4>

            <div className="grammar-tense-table-wrapper">
                <table className="grammar-tense-table">
                    <thead>
                        <tr>
                            <th>Время</th>

                            {PRONOUNS.map((pronoun) => (
                                <th key={pronoun} dir="rtl">
                                    {pronoun}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.tense}>
                                <th>{row.tense}</th>

                                {row.forms.map((form, index) => (
                                    <td key={`${row.tense}-${index}`} dir="rtl">
                                        {form}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default VerbTenseTable;
