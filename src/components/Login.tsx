import { MSG_TYPE } from "../Constants";
import ResponseMsg from "./ResponseMsg";
import { fetchUserSession } from "api/LoginSession";
import { signUpUserSession } from "api/SignUpSession";
import { GetUserRequestSchema } from "api/schemas/LoginSession";
import { PostUserRequestSchema } from "api/schemas/SignUpSession";
import { useState } from "react";
import { Modal } from "react-bootstrap";

interface loginProps {
    show: boolean;
    componentId: string;
    isLogin: boolean;
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
    onHide: React.Dispatch<React.SetStateAction<boolean>>;
    setUser: React.Dispatch<React.SetStateAction<string>>;
}

export default function LoginModal({
    show,
    componentId,
    isLogin,
    setIsLogin,
    onHide,
    setUser
}: loginProps) {
    const [username, setUsername] = useState("");
    const [pwd1, setPwd1] = useState("");
    const [pwd2, setPwd2] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(MSG_TYPE.Unknown);
    const [isLock, setIsLock] = useState(false);

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
                setIsLock(true);
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
            setIsLock(true);
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

    return (
        <Modal
            show={show}
            onHide={() => (
                onHide(false), setIsLogin(true), clearForm(), setIsLock(false)
            )}
            id={componentId}
            size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {isLogin === true ? "Login" : "Sign up"}
                    <br></br>
                    <small>to continue to your AI Advisor</small>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <label htmlFor="username">Input your username:</label>
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter your username"
                            id="username"
                            onChange={(e: React.FormEvent<HTMLInputElement>) =>
                                setUsername(e.currentTarget.value)
                            }
                            disabled={isLock}
                        ></input>
                    </div>
                    <label htmlFor="password">Input your password:</label>
                    <div className="input-group mb-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter your password"
                            id="password"
                            onChange={(e: React.FormEvent<HTMLInputElement>) =>
                                setPwd1(e.currentTarget.value)
                            }
                            disabled={isLock}
                        ></input>
                    </div>
                    {!isLogin && (
                        <div>
                            <label htmlFor="password2">
                                Confirm your password:
                            </label>
                            <div className="input-group mb-3">
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Repeat your password"
                                    id="password2"
                                    onChange={(
                                        e: React.FormEvent<HTMLInputElement>
                                    ) => setPwd2(e.currentTarget.value)}
                                    disabled={isLock}
                                ></input>
                            </div>
                        </div>
                    )}
                </form>
                <div className="flex justify-between">
                    <button
                        className="btn btn-primary"
                        onClick={() =>
                            isLogin ? setIsLogin(false) : setIsLogin(true)
                        }
                        disabled={isLock}
                    >
                        {isLogin ? "Create account" : "Sign in"}
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => handleSubmitForm(isLogin)}
                        disabled={isLock}
                    >
                        {isLogin ? "Sign in" : "Sign up"}
                    </button>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="col-12">
                    <ResponseMsg
                        type={messageType}
                        content={message}
                        setMessage={setMessage}
                    ></ResponseMsg>
                </div>
            </Modal.Footer>
        </Modal>
    );
}
