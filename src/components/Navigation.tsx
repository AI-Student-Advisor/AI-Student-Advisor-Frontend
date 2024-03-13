import "../css/Navigation.css";
import "bootstrap/dist/css/bootstrap.css";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

interface loginProps {
    userID: string;
    sessions: string[];
    setUserID: React.Dispatch<React.SetStateAction<string>>;
    setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    setSessions: React.Dispatch<React.SetStateAction<never[]>>;
}

export default function NavbarComponent({
    userID,
    setIsOpenModal,
    sessions,
    setSessions,
    setUserID
}: loginProps) {
    function logOut() {
        setUserID("");
        setSessions([]);
    }

    //Handle Loading Chat history with user sessions
    function test() {
        console.log(sessions);
    }
    return (
        <>
            <Navbar
                className="bg-body-tertiary"
                variant="dark"
                bg="dark"
                data-bs-theme="dark"
                expand="lg"
            >
                <Container fluid>
                    <Navbar.Brand>AI Student Advisor</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="\Chat" onClick={() => test()}>
                            Home
                        </Nav.Link>
                        <Nav.Link href="">About</Nav.Link>
                        <Nav.Link href="">Q&A</Nav.Link>
                    </Nav>
                </Container>
                <Nav>
                    {userID === "" && (
                        <Button
                            variant="outline-light"
                            data-bs-toggle="modal"
                            data-bs-target="#loginModal"
                            onClick={() => {
                                setIsOpenModal(true);
                            }}
                        >
                            Login
                        </Button>
                    )}
                    {userID !== "" && (
                        <DropdownButton
                            id="dropdown-button-dark-example2"
                            variant="secondary"
                            title={"Welcome ".concat(userID)}
                            className="mt-2"
                            data-bs-theme="dark"
                        >
                            <Dropdown.Item onClick={() => logOut()} active>
                                Log out
                            </Dropdown.Item>
                        </DropdownButton>
                    )}
                </Nav>
            </Navbar>
        </>
    );
}
