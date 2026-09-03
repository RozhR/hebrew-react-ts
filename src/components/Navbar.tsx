import { useEffect, useState } from 'react'
import type { Category } from '../types'
import { isLevelUnlocked } from '../utils/progress'

type MenuCategory = {
    title: string
    category: Category
    levels: number
}

type NavbarProps = {
    onSelectLevel: (
        category: Category,
        level: number,
    ) => void
}

function Navbar({ onSelectLevel }: NavbarProps) {
    const [, setUpdate] = useState(0)

    useEffect(() => {
        const handleLevelsUpdated = () => {
            setUpdate((prev) => prev + 1)
        }

        window.addEventListener(
            'levelsUpdated',
            handleLevelsUpdated,
        )

        return () => {
            window.removeEventListener(
                'levelsUpdated',
                handleLevelsUpdated,
            )
        }
    }, [])

    const categories: MenuCategory[] = [
        {
            title: 'Глаголы',
            category: 'verbs',
            levels: 25,
        },
        {
            title: 'Прилагательные',
            category: 'adjectives',
            levels: 25,
        },
        {
            title: 'Наречия',
            category: 'adverbs',
            levels: 15,
        },
    ]

    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li>
                    <a href="/">Главная</a>
                </li>

                {categories.map((category) => (
                    <li
                        className="dropdown"
                        key={category.category}
                    >
                        <button
                            type="button"
                            className="dropdown-toggle"
                        >
                            {category.title} ▾
                        </button>

                        <ul className="styled-dropdown dropdown-menu">
                            {Array.from(
                                { length: category.levels },
                                (_, index) => index + 1,
                            ).map((level) => {
                                const unlocked = isLevelUnlocked(
                                    category.category,
                                    level,
                                )

                                return (
                                    <li key={level}>
                                        {unlocked ? (
                                            <button
                                                type="button"
                                                className="level-link"
                                                onClick={() =>
                                                    onSelectLevel(
                                                        category.category,
                                                        level,
                                                    )
                                                }
                                            >
                                                Уровень {level}
                                            </button>
                                        ) : (
                                            <span className="locked-link">
                                                🔒 Уровень {level}
                                            </span>
                                        )}
                                    </li>
                                )
                            })}
                        </ul>
                    </li>
                ))}

                <li>
                    <a href="#">Грамматика</a>
                </li>

                <li>
                    <a href="#">Статистика</a>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar