import type { ReactNode } from "react";

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
                    <h3 className="grammar-word-hebrew" dir="rtl">
                        {title}
                    </h3>

                    <p className="grammar-word-translation">{translation}</p>
                </div>

                <div className="grammar-word-meta">
                    <span>Уровень {level}</span>
                </div>
            </div>

            <div className="grammar-word-actions">
                <button type="button" className="grammar-details-btn" onClick={onToggle}>
                    {expanded ? "Свернуть" : "Подробнее"}
                </button>

                <button type="button" className="grammar-remove-btn" onClick={onRemove}>
                    Удалить
                </button>
            </div>

            {expanded && <div className="grammar-word-details">{children}</div>}
        </article>
    );
}

export default GrammarCard;
