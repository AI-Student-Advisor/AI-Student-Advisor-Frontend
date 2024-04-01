import HomeNavBar from "components/HomeNavBar.tsx";
import React, { useState } from "react";
import { useDarkMode } from "usehooks-ts";

interface AboutProps extends React.ComponentProps<"div"> {
    darkMode: ReturnType<typeof useDarkMode>;
    userID: string;
    setUserID: React.Dispatch<React.SetStateAction<string>>;
}

export default function About({
    darkMode,
    userID,
    setUserID,
    ...otherProps
}: AboutProps) {
    const [, setModal] = useState(false);

    return (
        <div className="h-full" {...otherProps}>
            <HomeNavBar
                userID={userID}
                setUserID={setUserID}
                setIsOpenModal={setModal}
                darkMode={darkMode}
                currentPage="about"
            ></HomeNavBar>
            <div className="flex w-full h-full justify-center items-center">
                TODO
            </div>
        </div>
    );
}
