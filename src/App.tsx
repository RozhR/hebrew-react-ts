import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./components/Home";
import LearningPage from "./components/LearningPage";
import Navbar from "./components/Navbar";
import Statistics from "./components/Statistics";

import "./App.css";

const Grammar = lazy(() => import("./components/Grammar"));
const GrammarTest = lazy(() => import("./components/GrammarTest"));

function App() {
    return (
        <>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/statistics" element={<Statistics />} />

                <Route
                    path="/grammar"
                    element={
                        <Suspense
                            fallback={<div className="grammar-loading">Загрузка грамматики...</div>}
                        >
                            <Grammar />
                        </Suspense>
                    }
                />

                <Route
                    path="/grammar/test"
                    element={
                        <Suspense
                            fallback={<div className="grammar-loading">Загрузка теста...</div>}
                        >
                            <GrammarTest />
                        </Suspense>
                    }
                />

                <Route path="/:category/:level" element={<LearningPage />} />

                <Route path="/:category/:level/test" element={<LearningPage testMode />} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}

export default App;
