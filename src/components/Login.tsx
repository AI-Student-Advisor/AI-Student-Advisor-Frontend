import { MSG_TYPE } from "../Constants";
import ResponseMsg from "./ResponseMsg";
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
import { useState } from "react";

interface loginProps {
    show: boolean;
    componentId: string;
    onHide: React.Dispatch<React.SetStateAction<boolean>>;
    setUser: React.Dispatch<React.SetStateAction<string>>;
}

export default function LoginModal({
    show,
    componentId,
    onHide,
    setUser
}: loginProps) {
    const [username, setUsername] = useState("");
    const [pwd1, setPwd1] = useState("");
    const [pwd2, setPwd2] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(MSG_TYPE.Unknown);

    //Check whether it is in login page or sign up page.
    const [isLogin, setIsLogin] = useState(true);

    function submitFormWithEnter(
        e: KeyboardEvent | React.KeyboardEvent<HTMLInputElement>
    ) {
        if (e.key === "Enter") {
            handleSubmitForm(isLogin);
        }
    }

    function handleSubmitForm(isLogin: boolean) {
        if (isLogin) {
            handleUserLogin(username, pwd1);
        } else {
            handleUserSignUp(username, pwd1, pwd2);
        }
        console.log("User: ", { username }, "\nPwd1: ", { pwd1 }, "\nPwd2: ", {
            pwd2
        });
    }

    async function handleUserSignUp(
        username: string,
        pwd1: string,
        pwd2: string
    ) {
        if (pwd1 !== pwd2) {
            printMessage(
                "your passwords are inconsistent. Please try again",
                MSG_TYPE.Info
            );
        } else {
            const request = PostUserRequestSchema.parse({
                username: username,
                password: pwd1
            });
            const result = await signUpUserSession(request);
            if (result.status === "success") {
                printMessage("Welcome! ".concat(username), MSG_TYPE.Success);
                setUser(username);
            } else if (result.status === "fail") {
                printMessage(result.reason, MSG_TYPE.Error);
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
            printMessage("Welcome back! ".concat(username), MSG_TYPE.Success);
            setUser(username);
        } else if (result.status === "fail") {
            printMessage(result.reason, MSG_TYPE.Error);
        }
    }

    //Clear the user input after closing the login modal
    function clearForm() {
        setUsername("");
        setPwd1("");
        setPwd2("");
        setMessage("");
        setMessageType(MSG_TYPE.Unknown);
    }

    function printMessage(message: string, messageType: MSG_TYPE) {
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
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        {isLogin === true ? "Login" : "Sign up"}
                        <br></br>
                        <small>to continue to your AI Advisor</small>
                    </ModalHeader>
                    <ModalBody>
                        <Input
                            autoFocus
                            label="Email"
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
                                label="password2"
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
                            {isLogin ? "Create account" : "Use signed Account"}
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

            <ResponseMsg
                type={messageType}
                content={message}
                setMessage={setMessage}
                handler={closeModal}
            ></ResponseMsg>
        </>
    );
}
