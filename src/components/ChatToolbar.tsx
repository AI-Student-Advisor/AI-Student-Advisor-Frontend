import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Switch } from "@nextui-org/react";
import React from "react";
import { useDarkMode } from "usehooks-ts";

export interface ChatToolbarProps extends React.ComponentProps<"div"> {
    darkMode: ReturnType<typeof useDarkMode>;
    title: string;
}

export default function ChatToolbar({
    darkMode,
    title,
    ...otherProps
}: ChatToolbarProps) {
    return (
        <div {...otherProps}>
            <div></div>
            <h1 className="font-bold text-2xl">{title}</h1>
            <Switch
                isSelected={!darkMode.isDarkMode}
                onValueChange={darkMode.toggle}
                thumbIcon={(props) =>
                    props.isSelected ? <FontAwesomeIcon icon={faSun} /> : <></>
                }
                endContent={<FontAwesomeIcon icon={faMoon} />}
            />
        </div>
    );
}
