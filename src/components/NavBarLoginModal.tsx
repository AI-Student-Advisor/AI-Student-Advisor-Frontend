import { PASSWORD_MINIMUM_LENGTH } from "../Constants.ts";
import { PasswordSchema, UsernameSchema } from "../api/schemas/Common.ts";
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    type ModalProps,
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@nextui-org/react";
import { logIn } from "api/LogIn.ts";
import { signUp } from "api/SignUp.ts";
import { PostUserRequestSchema as PostUserRequestSchemaLogIn } from "api/schemas/LogIn.ts";
import { PostUserRequestSchema as PostUserRequestSchemaSignUp } from "api/schemas/SignUp.ts";
import React, { useState } from "react";

interface NavBarLoginModalProps extends ModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    onLogIn: (token: string) => void;
    isDarkMode: boolean;
}

export type LandingLoginModalMessageType =
    | "info"
    | "success"
    | "error"
    | "unknown";

export default function NavBarLoginModal({
    isOpen,
    onOpenChange,
    onLogIn,
    isDarkMode,
    ...otherProps
}: NavBarLoginModalProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
        useState("");
    const [serverErrorMessage, setServerErrorMessage] = useState("");

    // Check whether it is in login page or sign up page
    const [isLogInForm, setIsLogInForm] = useState(true);

    async function handleSubmitFormKeyboard(
        e: KeyboardEvent | React.KeyboardEvent<HTMLInputElement>,
        onClose: () => void
    ) {
        if (e.key === "Enter") {
            await handleSubmitForm(onClose);
        }
    }

    async function handleSubmitForm(onClose: () => void) {
        try {
            if (isLogInForm) {
                await handleUserLogIn();
                onClose();
                return;
            }
            await handleUserSignUp();
            onClose();
        } catch (e) {
            if (e instanceof Error) {
                setServerErrorMessage(e.message);
                return;
            }
            setServerErrorMessage(String(e));
        }
    }

    function handleUsernameChange(value: string) {
        value = value.trim();

        if (value === "") {
            setUsername(value);
            setUsernameErrorMessage("Please enter your username");
            return;
        }

        try {
            const username = UsernameSchema.parse(value);
            setUsername(username);
            setUsernameErrorMessage("");
        } catch (e) {
            /* ignored */
        }
    }

    function handlePasswordChange(value: string) {
        value = value.trim();

        if (value === "") {
            setPassword(value);
            setPasswordErrorMessage("Please enter your password");
            return;
        }

        if (value.length < PASSWORD_MINIMUM_LENGTH) {
            setPassword(value);
            setPasswordErrorMessage("Password is too short");
            return;
        }

        try {
            const password = PasswordSchema.parse(value);
            setPassword(password);
            setPasswordErrorMessage("");

            if (confirmPassword !== "" && value !== confirmPassword) {
                setConfirmPasswordErrorMessage("Password does not match");
            } else {
                setConfirmPasswordErrorMessage("");
            }
        } catch (e) {
            /* ignored */
        }
    }

    function handleConfirmPasswordChange(value: string) {
        value = value.trim();

        if (value === "") {
            setConfirmPassword(value);
            setConfirmPasswordErrorMessage("Please confirm your password");
            return;
        }

        if (value.length < PASSWORD_MINIMUM_LENGTH) {
            setConfirmPassword(value);
            setConfirmPasswordErrorMessage("Password is too short");
            return;
        }

        if (value !== password) {
            setConfirmPassword(value);
            setConfirmPasswordErrorMessage("Password does not match");
            return;
        }

        try {
            const password = PasswordSchema.parse(value);
            setConfirmPassword(password);
            setConfirmPasswordErrorMessage("");
        } catch (e) {
            /* ignored */
        }
    }

    function isButtonDisabled() {
        const fieldNotEmpty = Boolean(
            username && password && (isLogInForm || confirmPassword)
        );
        const hasErrorMessages = Boolean(
            usernameErrorMessage ||
                passwordErrorMessage ||
                (!isLogInForm && confirmPasswordErrorMessage)
        );
        return !fieldNotEmpty || hasErrorMessages;
    }

    async function handleUserSignUp() {
        const request = PostUserRequestSchemaSignUp.parse({
            username: username,
            password: password
        });
        const result = await signUp(request);
        onLogIn(result.token);
        reset();
    }

    async function handleUserLogIn() {
        const request = PostUserRequestSchemaLogIn.parse({
            username: username,
            password: password
        });
        const result = await logIn(request);
        onLogIn(result.token);
        reset();
    }

    // Reset the modal state
    function reset() {
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setUsernameErrorMessage("");
        setPasswordErrorMessage("");
        setConfirmPasswordErrorMessage("");
        setServerErrorMessage("");
    }

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isDismissable={false}
            size="lg"
            placement="center"
            backdrop="blur"
            className={`${isDarkMode ? "dark" : ""} text-foreground`}
            {...otherProps}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            {isLogInForm ? "Login" : "Sign up"}
                            <small>to continue to your AI Advisor</small>
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                autoFocus
                                label="Username"
                                placeholder="Enter your username"
                                variant="bordered"
                                id="username"
                                isRequired
                                isInvalid={usernameErrorMessage !== ""}
                                errorMessage={usernameErrorMessage}
                                value={username}
                                onValueChange={handleUsernameChange}
                                onKeyDown={(e) =>
                                    handleSubmitFormKeyboard(e, onClose)
                                }
                            ></Input>
                            <Input
                                label="Password"
                                placeholder="Enter your password"
                                type="password"
                                variant="bordered"
                                id="password"
                                isRequired
                                isInvalid={passwordErrorMessage !== ""}
                                errorMessage={passwordErrorMessage}
                                value={password}
                                onValueChange={handlePasswordChange}
                                onKeyDown={(e) =>
                                    handleSubmitFormKeyboard(e, onClose)
                                }
                            ></Input>
                            {!isLogInForm && (
                                <Input
                                    label="Confirm Password"
                                    placeholder="Confirm your password"
                                    type="password"
                                    variant="bordered"
                                    id="confirm-password"
                                    isRequired
                                    isInvalid={
                                        confirmPasswordErrorMessage !== ""
                                    }
                                    errorMessage={confirmPasswordErrorMessage}
                                    value={confirmPassword}
                                    onValueChange={handleConfirmPasswordChange}
                                    onKeyDown={(e) =>
                                        handleSubmitFormKeyboard(e, onClose)
                                    }
                                ></Input>
                            )}
                        </ModalBody>
                        <ModalFooter className="justify-between">
                            <Button
                                color="primary"
                                onPress={() => setIsLogInForm(!isLogInForm)}
                                variant="bordered"
                            >
                                {isLogInForm
                                    ? "Create account"
                                    : "Use Signed Account"}
                            </Button>
                            <Popover
                                placement="bottom"
                                color="danger"
                                isOpen={serverErrorMessage !== ""}
                                onOpenChange={(open) =>
                                    !open && setServerErrorMessage("")
                                }
                                className={`${isDarkMode ? "dark" : ""} text-foreground`}
                            >
                                <PopoverTrigger>
                                    <Button
                                        color="primary"
                                        variant="solid"
                                        className="text-white"
                                        onClick={() =>
                                            handleSubmitForm(onClose)
                                        }
                                        isDisabled={isButtonDisabled()}
                                    >
                                        {isLogInForm ? "Sign In" : "Sign Up"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <div
                                        className="max-w-unit-5xl"
                                        style={{ wordBreak: "break-all" }}
                                    >
                                        {serverErrorMessage}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
