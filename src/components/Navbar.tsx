import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import { CATEGORY_CONFIG, CATEGORIES } from "../config/categories";
import { useGrammar } from "../context/GrammarContext";
import type { Category } from "../types";
import { isLevelUnlocked } from "../utils/progress";

function Navbar() {
    const [, setUpdate] = useState(0);
    const [openCategory, setOpenCategory] = useState<Category | null>(null);

    const { count } = useGrammar();

    useEffect(() => {
        const handleLevelsUpdated = () => {
            setUpdate((previous) => previous + 1);
        };

        window.addEventListener("levelsUpdated", handleLevelsUpdated);

        return () => {
            window.removeEventListener("levelsUpdated", handleLevelsUpdated);
        };
    }, []);

    const closeMenu = () => {
        setOpenCategory(null);
    };

    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li>
                    <NavLink to="/" className="nav-link" onClick={closeMenu}>
                        Главная
                    </NavLink>
                </li>

                {CATEGORIES.map((category) => {
                    const config = CATEGORY_CONFIG[category];

                    return (
                        <li className="dropdown" key={category} onMouseLeave={closeMenu}>
                            <button
                                type="button"
                                className="dropdown-toggle"
                                onClick={() =>
                                    setOpenCategory(openCategory === category ? null : category)
                                }
                            >
                                {config.title} ▾
                            </button>

                            <ul
                                className={
                                    openCategory === category
                                        ? "styled-dropdown dropdown-menu open"
                                        : "styled-dropdown dropdown-menu"
                                }
                            >
                                {Array.from({ length: config.levels }, (_, index) => index + 1).map(
                                    (level) => {
                                        const unlocked = isLevelUnlocked(category, level);

                                        return (
                                            <li key={level}>
                                                {unlocked ? (
                                                    <NavLink
                                                        to={`/${category}/${level}`}
                                                        className="level-link"
                                                        onClick={closeMenu}
                                                    >
                                                        Уровень {level}
                                                    </NavLink>
                                                ) : (
                                                    <span className="locked-link">
                                                        🔒 Уровень {level}
                                                    </span>
                                                )}
                                            </li>
                                        );
                                    },
                                )}
                            </ul>
                        </li>
                    );
                })}

                <li>
                    <NavLink
                        to="/grammar"
                        className="nav-link grammar-nav-link"
                        onClick={closeMenu}
                    >
                        <span>Грамматика</span>

                        <span className="grammar-counter">{count}</span>
                    </NavLink>
                </li>

                <li>
                    <NavLink to="/statistics" className="nav-link" onClick={closeMenu}>
                        Статистика
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
