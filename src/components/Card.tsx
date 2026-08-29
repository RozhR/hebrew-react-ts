import { useState } from 'react'
import type { CardData } from '../types'

type CardProps = {
    card: CardData
}

function Card({ card }: CardProps) {
    const [isFlipped, setIsFlipped] = useState(false)

    const handleClick = () => {
        setIsFlipped(!isFlipped)
    }

    return (
        <div
            className={`card ${isFlipped ? 'flipped' : ''}`}
            onClick={handleClick}
        >
            <div className="card-inner">
                <div className="card-front">
                    {card.hebrew}
                </div>

                <div className="card-back">
                    {card.russian}
                </div>
            </div>
        </div>
    )
}

export default Card