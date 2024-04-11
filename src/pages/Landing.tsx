import type { PageProps } from "./interfaces/PageProps.ts";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import NavBar from "components/NavBar.tsx";

interface LandingProps extends PageProps {}

export default function Landing({
    onLogIn,
    onLogOut,
    displayName,
    darkMode,
    token,
    jwt,
    ...otherProps
}: LandingProps) {
    return (
        <div className="h-full" {...otherProps}>
            <NavBar
                onLogIn={onLogIn}
                onLogOut={onLogOut}
                displayName={displayName}
                darkMode={darkMode}
                currentPage="home"
            ></NavBar>
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
        </div>
    );
}
