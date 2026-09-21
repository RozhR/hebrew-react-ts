import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";

import App from "./App.tsx";
import { GrammarProvider } from "./context/GrammarProvider";


createRoot(
    document.getElementById("root")!,
).render(
    <StrictMode>
        <BrowserRouter>
            <GrammarProvider>
                <App />
            </GrammarProvider>
        </BrowserRouter>
    </StrictMode>,
);