import LandingLoginResponseDialog from "./LandingLoginResponseDialog.tsx";
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader
} from "@nextui-org/react";
import { fetchUserSession } from "api/LoginSession";
import { signUpUserSession } from "api/SignUpSession";
import { GetUserRequestSchema } from "api/schemas/LoginSession";
import { PostUserRequestSchema } from "api/schemas/SignUpSession";
import React, { useState } from "react";

interface LandingLoginModalProps {
    show: boolean;
    componentId: string;
    onHide: React.Dispatch<React.SetStateAction<boolean>>;
    setUser: React.Dispatch<React.SetStateAction<string>>;
    isDarkMode: boolean;
}

export type LandingLoginModalMessageType =
    | "info"
    | "success"
    | "error"
    | "unknown";

export default function LandingLoginModal({
    show,
    componentId,
    onHide,
    setUser,
    isDarkMode,
    ...otherProps
}: LandingLoginModalProps) {
    const [username, setUsername] = useState("");
    const [pwd1, setPwd1] = useState("");
    const [pwd2, setPwd2] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] =
        useState<LandingLoginModalMessageType>("unknown");

    // Check whether it is in login page or sign up page
    const [isLogin, setIsLogin] = useState(true);

    async function submitFormWithEnter(
        e: KeyboardEvent | React.KeyboardEvent<HTMLInputElement>
    ) {
        if (e.key === "Enter") {
            await handleSubmitForm(isLogin);
        }
    }

    async function handleSubmitForm(isLogin: boolean) {
        if (isLogin) {
            await handleUserLogin(username, pwd1);
        } else {
            await handleUserSignUp(username, pwd1, pwd2);
        }
    }

    async function handleUserSignUp(
        username: string,
        pwd1: string,
        pwd2: string
    ) {
        if (pwd1 !== pwd2) {
            setModalMessage(
                "Your passwords are inconsistent. Please try again.",
                "info"
            );
        } else {
            const request = PostUserRequestSchema.parse({
                username: username,
                password: pwd1
            });
            const result = await signUpUserSession(request);
            if (result.status === "success") {
                setModalMessage("Welcome! ".concat(username), "success");
                setUser(username);
            } else if (result.status === "fail") {
                setModalMessage(result.reason, "error");
            }
        }
    }

    async function handleUserLogin(username: string, pwd: string) {
        const request = GetUserRequestSchema.parse({
            username: username,
            password: pwd
        });
        const result = await fetchUserSession(request);
        if (result.status === "success") {
            setModalMessage("Welcome back! ".concat(username), "success");
            setUser(username);
        } else if (result.status === "fail") {
            setModalMessage(result.reason, "error");
        }
    }

    //Clear the user input after closing the login modal
    function clearForm() {
        setUsername("");
        setPwd1("");
        setPwd2("");
        setMessage("");
        setMessageType("unknown");
    }

    function setModalMessage(
        message: string,
        messageType: LandingLoginModalMessageType
    ) {
        setMessage(message);
        setMessageType(messageType);
    }

    function closeModal() {
        onHide(false);
        setIsLogin(true);
        clearForm();
    }

    return (
        <>
            <Modal
                isOpen={show}
                onOpenChange={() => closeModal()}
                id={componentId}
                size="lg"
                placement="center"
                backdrop="blur"
                className={`${isDarkMode ? "dark" : ""} text-foreground`}
                {...otherProps}
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        {isLogin ? "Login" : "Sign up"}
                        <br></br>
                        <small>to continue to your AI Advisor</small>
                    </ModalHeader>
                    <ModalBody>
                        <Input
                            autoFocus
                            label="Username"
                            placeholder="Enter your username"
                            variant="bordered"
                            id="username"
                            onChange={(e: React.FormEvent<HTMLInputElement>) =>
                                setUsername(e.currentTarget.value)
                            }
                            onKeyDown={(e) => submitFormWithEnter(e)}
                        ></Input>
                        <Input
                            label="Password"
                            placeholder="Enter your password"
                            type="password"
                            variant="bordered"
                            id="password"
                            onChange={(e: React.FormEvent<HTMLInputElement>) =>
                                setPwd1(e.currentTarget.value)
                            }
                            onKeyDown={(e) => submitFormWithEnter(e)}
                        ></Input>

                        {!isLogin && (
                            <Input
                                label="Confirm Password"
                                placeholder="Confirm your password"
                                type="password"
                                variant="bordered"
                                id="password2"
                                onChange={(
                                    e: React.FormEvent<HTMLInputElement>
                                ) => setPwd2(e.currentTarget.value)}
                                onKeyDown={(e) => submitFormWithEnter(e)}
                            ></Input>
                        )}
                    </ModalBody>
                    <ModalFooter className="justify-between">
                        <Button
                            color="danger"
                            onPress={() =>
                                isLogin ? setIsLogin(false) : setIsLogin(true)
                            }
                            variant="light"
                        >
                            {isLogin ? "Create account" : "Use Signed Account"}
                        </Button>
                        <Button
                            color="danger"
                            onPress={() => handleSubmitForm(isLogin)}
                        >
                            {isLogin ? "Sign in" : "Sign up"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <LandingLoginResponseDialog
                type={messageType}
                content={message}
                setMessage={setMessage}
                handler={closeModal}
                isDarkMode={isDarkMode}
            ></LandingLoginResponseDialog>
        </>
    );
}
