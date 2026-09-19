import {
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import "./App.css";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Grammar from "./components/Grammar";
import Statistics from "./components/Statistics";
import LearningPage from "./components/LearningPage";


function App() {
    return (
        <>
            <Navbar />

            <Routes>
                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/statistics"
                    element={<Statistics />}
                />

                <Route
                    path="/grammar"
                    element={<Grammar />}
                />

                <Route
                    path="/:category/:level"
                    element={<LearningPage />}
                />

                <Route
                    path="/:category/:level/test"
                    element={
                        <LearningPage testMode />
                    }
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />
            </Routes>
        </>
    );
}

export default App;