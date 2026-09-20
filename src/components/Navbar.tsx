import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import type { Category } from "../types";
import { isLevelUnlocked } from "../utils/progress";

type MenuCategory = {
    title: string;
    category: Category;
    levels: number;
};

function Navbar() {
    const [, setUpdate] = useState(0);

    const [openCategory, setOpenCategory] =
        useState<Category | null>(null);

    useEffect(() => {
        const handleLevelsUpdated = () => {
            setUpdate((prev) => prev + 1);
        };

        window.addEventListener(
            "levelsUpdated",
            handleLevelsUpdated,
        );

        return () => {
            window.removeEventListener(
                "levelsUpdated",
                handleLevelsUpdated,
            );
        };
    }, []);

    const categories: MenuCategory[] = [
        {
            title: "Глаголы",
            category: "verbs",
            levels: 25,
        },
        {
            title: "Прилагательные",
            category: "adjectives",
            levels: 25,
        },
        {
            title: "Наречия",
            category: "adverbs",
            levels: 15,
        },
    ];

    const closeMenu = () => {
        setOpenCategory(null);
    };

    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li>
                    <NavLink
                        to="/"
                        className="nav-link"
                        onClick={closeMenu}
                    >
                        Главная
                    </NavLink>
                </li>

                {categories.map((category) => (
                    <li
                        className="dropdown"
                        key={category.category}
                    >
                        <button
                            type="button"
                            className="dropdown-toggle"
                            onClick={() =>
                                setOpenCategory(
                                    openCategory ===
                                    category.category
                                        ? null
                                        : category.category,
                                )
                            }
                        >
                            {category.title} ▾
                        </button>

                        <ul
                            className={
                                openCategory ===
                                category.category
                                    ? "styled-dropdown dropdown-menu open"
                                    : "styled-dropdown dropdown-menu"
                            }
                        >
                            {Array.from(
                                {
                                    length:
                                    category.levels,
                                },
                                (_, index) =>
                                    index + 1,
                            ).map((level) => {
                                const unlocked =
                                    isLevelUnlocked(
                                        category.category,
                                        level,
                                    );

                                return (
                                    <li key={level}>
                                        {unlocked ? (
                                            <NavLink
                                                to={`/${category.category}/${level}`}
                                                className="level-link"
                                                onClick={
                                                    closeMenu
                                                }
                                            >
                                                Уровень{" "}
                                                {level}
                                            </NavLink>
                                        ) : (
                                            <span className="locked-link">
                                                🔒 Уровень{" "}
                                                {level}
                                            </span>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </li>
                ))}

                <li>
                    <NavLink
                        to="/grammar"
                        className="nav-link"
                        onClick={closeMenu}
                    >
                        Грамматика
                    </NavLink>
                </li>

                <li>
                    <NavLink
                        to="/statistics"
                        className="nav-link"
                        onClick={closeMenu}
                    >
                        Статистика
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;