import NavbarComponent from "../components/Navigation";
import TestImage from "../images/test.jpg";
import Login from "components/Login";
import { useState } from "react";
import { useDarkMode } from "usehooks-ts";

export interface ChatProps extends React.ComponentProps<"div"> {
    darkMode: ReturnType<typeof useDarkMode>;
}

export default function Landing() {
    const [showModal, setModal] = useState(false);
    const [userID, setUserID] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [sessions, setSessions] = useState([]);
    return (
        <>
            <NavbarComponent
                userID={userID}
                setUserID={setUserID}
                setIsOpenModal={setModal}
                sessions={sessions}
                setSessions={setSessions}
            ></NavbarComponent>
            <header className="py-3 mb-4 border-bottom">
                <div className="container d-flex flex-wrap justify-content-center">
                    <div className="col">
                        <img src={TestImage} className="img-fluid"></img>
                    </div>
                    <div className="col-8">
                        <br></br>
                        <h1>AI Student Advisor</h1>
                        <br></br>
                        <br></br>
                        <br></br>
                        <h5>
                            The AI component of the AI Student Advisor is
                            responsible for providing the chat engine with the
                            ability to answer questions based on the data and
                            remember conversation history.
                        </h5>
                        <br></br>
                        <h6>Asking your question by quick start:</h6>
                        <br></br>
                        <form className="col-8 mb-3 mb-lg-0">
                            <input
                                type="search"
                                className="form-control"
                                placeholder="Search..."
                                aria-label="Search"
                            ></input>
                        </form>
                        <Login
                            show={showModal}
                            componentId="loginModal"
                            isLogin={isLogin}
                            setIsLogin={setIsLogin}
                            onHide={setModal}
                            setUser={setUserID}
                        ></Login>
                    </div>
                </div>
            </header>
        </>
    );
}
