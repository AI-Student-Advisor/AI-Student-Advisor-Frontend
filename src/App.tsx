import { JWT_VERIFY_CLOCK_TOLERANCE, JWT_VERIFY_ISSUER } from "./Constants.ts";
import { JWTVerifier } from "./auth/JWTVerifier.ts";
import About from "./pages/About.tsx";
import Chat from "./pages/Chat.tsx";
import { NextUIProvider } from "@nextui-org/react";
import Landing from "pages/Landing";
import { useEffect, useRef, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useDarkMode, useLocalStorage } from "usehooks-ts";

export default function App() {
    const darkMode = useDarkMode();
    const navigate = useNavigate();
    const [token, setToken] = useLocalStorage("token", "");
    const [displayName, setDisplayName] = useState("");
    const jwtVerifier = useRef(
        new JWTVerifier({
            algorithms: ["ES256"],
            // 5 minutes
            clockTolerance: JWT_VERIFY_CLOCK_TOLERANCE,
            issuer: JWT_VERIFY_ISSUER
        })
    );

    function handleLogIn(token: string) {
        setToken(token);
    }

    function handleLogOut() {
        setDisplayName("");
        setToken("");
    }

    // Verify and decode the JWT token.
    // If the token is not valid, clear the storage
    useEffect(() => {
        if (!token) {
            handleLogOut();
        }

        void (async () => {
            try {
                const { username } = await jwtVerifier.current.decode(token);
                setDisplayName(username);
            } catch (e) {
                handleLogOut();
            }
        })();
    }, [token]);

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
                                onLogIn={handleLogIn}
                                onLogOut={handleLogOut}
                                displayName={displayName}
                                darkMode={darkMode}
                                token={token}
                            ></Landing>
                        }
                    ></Route>
                    <Route
                        path="/chat"
                        element={
                            <Chat darkMode={darkMode} token={token}></Chat>
                        }
                    ></Route>
                    <Route
                        path="/about"
                        element={
                            <About
                                onLogIn={handleLogIn}
                                onLogOut={handleLogOut}
                                displayName={displayName}
                                darkMode={darkMode}
                                token={token}
                            ></About>
                        }
                    ></Route>
                </Routes>
            </NextUIProvider>
        </div>
    );
}
