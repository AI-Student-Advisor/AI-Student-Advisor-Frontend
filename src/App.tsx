import About from "./pages/About.tsx";
import Chat from "./pages/Chat.tsx";
import { NextUIProvider } from "@nextui-org/react";
import Landing from "pages/Landing";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useDarkMode, useLocalStorage } from "usehooks-ts";

export default function App() {
    const darkMode = useDarkMode();
    const navigate = useNavigate();
    const [userID, setUserID] = useLocalStorage("userID", "");

    return (
        <div
            className={`${darkMode.isDarkMode ? "dark" : ""} text-foreground bg-background h-full w-full`}
        >
            {/* Quirk:
             *  For elements that live outside the React root container, dark theme
             *  does not apply to them. One has to assign "dark" class attribute to
             *  those elements manually.
             *
             *  Here I pass down the global dark mode state for the children
             *  that may go outside the root container, e.g. modals and menus
             *
             */}
            <NextUIProvider className="h-full w-full" navigate={navigate}>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Landing
                                darkMode={darkMode}
                                userID={userID}
                                setUserID={setUserID}
                            ></Landing>
                        }
                    ></Route>
                    <Route
                        path="/chat"
                        element={
                            <Chat darkMode={darkMode} userID={userID}></Chat>
                        }
                    ></Route>
                    <Route
                        path="/about"
                        element={
                            <About
                                darkMode={darkMode}
                                userID={userID}
                                setUserID={setUserID}
                            ></About>
                        }
                    ></Route>
                </Routes>
            </NextUIProvider>
        </div>
    );
}
