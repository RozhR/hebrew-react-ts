import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { GrammarProvider } from "./context/GrammarProvider";

import "./index.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <GrammarProvider>
                <App />
            </GrammarProvider>
        </BrowserRouter>
    </StrictMode>,
);
