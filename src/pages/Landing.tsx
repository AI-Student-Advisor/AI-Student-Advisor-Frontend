import { Card, CardBody, CardHeader } from "@nextui-org/react";
import HomeNavBar from "components/HomeNavBar.tsx";
import LandingLoginModal from "components/LandingLoginModal.tsx";
import React, { useState } from "react";
import { useDarkMode } from "usehooks-ts";

interface LandingProps extends React.ComponentProps<"div"> {
    darkMode: ReturnType<typeof useDarkMode>;
    userID: string;
    setUserID: React.Dispatch<React.SetStateAction<string>>;
}

export default function Landing({
    darkMode,
    userID,
    setUserID,
    ...otherProps
}: LandingProps) {
    const [showModal, setModal] = useState(false);

    return (
        <div className="h-full" {...otherProps}>
            <HomeNavBar
                userID={userID}
                setUserID={setUserID}
                setIsOpenModal={setModal}
                darkMode={darkMode}
                currentPage="home"
            ></HomeNavBar>
            <div className="flex w-full h-full justify-center items-center">
                <Card className="max-w-[600px] h-fit" shadow="lg">
                    <CardHeader className="text-4xl font-bold text-center">
                        <span className="w-full">AI Student Advisor</span>
                    </CardHeader>
                    <CardBody className="text-lg px-8">
                        <p>
                            The AI component of the AI Student Advisor is
                            responsible for providing the chat engine with the
                            ability to answer questions based on the data and
                            remember conversation history.
                        </p>
                    </CardBody>
                </Card>
            </div>
            <LandingLoginModal
                show={showModal}
                componentId="loginModal"
                onHide={setModal}
                setUser={setUserID}
                isDarkMode={darkMode.isDarkMode}
            ></LandingLoginModal>
        </div>
    );
}
