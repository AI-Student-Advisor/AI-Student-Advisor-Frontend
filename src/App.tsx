import Chat from "pages/Chat.tsx";
import { useDarkMode } from "usehooks-ts";

export default function App() {
    const darkMode = useDarkMode();

    return (
        <div
            className={`${darkMode.isDarkMode ? "dark" : ""} text-foreground bg-background full-screen`}
        >
            {/* Quirk:
             *  For elements that live outside the React root container, dark theme
             *  does not apply to them. One has to assign "dark" class attribute to
             *  those elements manually.
             *
             *  Here I pass down the global dark mode state for the children
             *  that may go outside the root container, e.g. modals and menus
             */}
            <Chat darkMode={darkMode} />
        </div>
    );
}
