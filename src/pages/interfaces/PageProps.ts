import React from "react";
import { useDarkMode } from "usehooks-ts";

export interface PageProps extends React.ComponentProps<"div"> {
    onLogIn: (token: string) => void;
    onLogOut: () => void;
    displayName: string;
    darkMode: ReturnType<typeof useDarkMode>;
    token: string;
}
