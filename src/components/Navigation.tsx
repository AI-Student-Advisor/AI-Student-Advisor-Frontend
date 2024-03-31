import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    Button,
    Switch,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "usehooks-ts";

interface loginProps {
    userID: string;
    setUserID: React.Dispatch<React.SetStateAction<string>>;
    setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    darkMode: ReturnType<typeof useDarkMode>;
}

export default function NavbarComponent({
    userID,
    setIsOpenModal,
    setUserID,
    darkMode
}: loginProps) {
    const navigate = useNavigate();
    function logOut() {
        setUserID("");
    }

    function handleClickAdvisor() {
        if (userID !== "") {
            navigate("/Chat");
        } else {
            setIsOpenModal(true);
        }
    }

    return (
        <Navbar
            className={darkMode.isDarkMode ? "bg-deepBlue" : "bg-midBlue"}
            shouldHideOnScroll
        >
            <NavbarBrand>
                <p className="font-bold text-inherit">AI Student Advisor</p>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="start">
                <NavbarItem isActive>
                    <Link
                        isBlock
                        href="\"
                        aria-current="page"
                        underline="always"
                    >
                        Home
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link
                        isBlock
                        color="foreground"
                        onClick={handleClickAdvisor}
                        // eslint-disable-next-line no-magic-numbers
                        href={void 0}
                    >
                        Advisor
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link isBlock color="foreground" href="\">
                        About
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                {userID === "" && (
                    <Button
                        className="hidden lg:flex"
                        variant="flat"
                        color="primary"
                        onClick={() => setIsOpenModal(true)}
                    >
                        Login
                    </Button>
                )}
                {userID !== "" && (
                    <Dropdown>
                        <DropdownTrigger>
                            <Button
                                color="primary"
                                variant="light"
                                className="capitalize"
                            >
                                Welcome! {userID}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Dropdown Variants"
                            color="primary"
                            variant="light"
                        >
                            <DropdownItem onClick={() => logOut()}>
                                Log out
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                )}

                <NavbarItem>
                    <Switch
                        isSelected={!darkMode.isDarkMode}
                        onValueChange={darkMode.toggle}
                        thumbIcon={(props) =>
                            props.isSelected ? (
                                <FontAwesomeIcon icon={faSun} />
                            ) : (
                                <></>
                            )
                        }
                        endContent={<FontAwesomeIcon icon={faMoon} />}
                    ></Switch>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
