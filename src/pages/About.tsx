import type { PageProps } from "./interfaces/PageProps.ts";
import NavBar from "components/NavBar.tsx";

interface AboutProps extends PageProps {}

export default function About({
    onLogIn,
    onLogOut,
    displayName,
    darkMode,
    token,
    jwt,
    ...otherProps
}: AboutProps) {
    return (
        <div className="h-full" {...otherProps}>
            <NavBar
                onLogIn={onLogIn}
                onLogOut={onLogOut}
                displayName={displayName}
                darkMode={darkMode}
                currentPage="about"
            ></NavBar>
            <div className="flex w-full h-full justify-center items-center">
                TODO
            </div>
        </div>
    );
}
