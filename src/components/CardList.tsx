import { useState } from "react";
import Card from "./Card";
import type { CardData } from "../types";

type CardListProps = {
    cards: CardData[];
    onStartTest: () => void;
};

function CardList({ cards, onStartTest }: CardListProps) {
    const [shuffledCards, setShuffledCards] = useState(cards);

    const shuffleCards = () => {
        const newCards = [...shuffledCards];

        for (let i = newCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [newCards[i], newCards[j]] = [
                newCards[j],
                newCards[i],
            ];
        }

        setShuffledCards(newCards);
    };

    return (
        <>
            <div className="functions">
                <button
                    type="button"
                    className="styled-btn"
                    onClick={shuffleCards}
                >
                    Перемешать
                </button>

                <button
                    type="button"
                    className="styled-btn"
                    onClick={onStartTest}
                >
                    Тестирование
                </button>
            </div>

            <div className="card-container">
                {shuffledCards.map((card, index) => (
                    <Card
                        key={`${card.hebrew}-${index}`}
                        card={card}
                    />
                ))}
            </div>
        </>
    );
}

export default CardList;