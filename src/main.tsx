import { NextUIProvider } from "@nextui-org/react";
import App from "App.tsx";
import "main.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <NextUIProvider className="h-full w-full">
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </NextUIProvider>
    </React.StrictMode>
);
