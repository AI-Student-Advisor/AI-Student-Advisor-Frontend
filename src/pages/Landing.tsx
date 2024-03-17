import NavbarComponent from "../components/Navigation";
import TestImage from "../images/test.jpg";
import Login from "components/Login";
import { useState } from "react";
import { useDarkMode } from "usehooks-ts";

interface LandingProps extends React.ComponentProps<"div"> {
    darkMode: ReturnType<typeof useDarkMode>;
    userID: string;
    setUserID: React.Dispatch<React.SetStateAction<string>>;
}

export default function Landing({ darkMode, userID, setUserID }: LandingProps) {
    const [showModal, setModal] = useState(false);
    const [sessions, setSessions] = useState([]);

    return (
        <>
            <NavbarComponent
                userID={userID}
                setUserID={setUserID}
                setIsOpenModal={setModal}
                sessions={sessions}
                setSessions={setSessions}
                darkMode={darkMode}
            ></NavbarComponent>
            <header
                className={`${darkMode.isDarkMode ? "bg-deepBlue2" : "bg-lightBlue2"} py-3 mb-4 border-bottom full-screen`}
            >
                <div className="container d-flex flex-wrap justify-content-center">
                    <div className="grid grid-cols-2 items-end">
                        <img
                            src={TestImage}
                            className="img-fluid w-1/3 justify-self-center"
                        ></img>
                        <div className="w-2/3">
                            <h1>AI Student Advisor</h1>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <h5>
                                The AI component of the AI Student Advisor is
                                responsible for providing the chat engine with
                                the ability to answer questions based on the
                                data and remember conversation history.
                            </h5>
                        </div>
                    </div>
                    <Login
                        show={showModal}
                        componentId="loginModal"
                        onHide={setModal}
                        setUser={setUserID}
                    ></Login>
                </div>
            </header>
        </>
    );
}
