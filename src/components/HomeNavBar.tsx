import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Link,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Switch
} from "@nextui-org/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "usehooks-ts";

interface HomeNavBarProps {
    userID: string;
    setUserID: React.Dispatch<React.SetStateAction<string>>;
    setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    darkMode: ReturnType<typeof useDarkMode>;
    currentPage: "home" | "about";
}

export default function HomeNavBar({
    userID,
    setIsOpenModal,
    setUserID,
    darkMode,
    currentPage,
    ...otherProps
}: HomeNavBarProps) {
    const navigate = useNavigate();

    function logOut() {
        setUserID("");
    }

    return (
        <Navbar {...otherProps} shouldHideOnScroll className="absolute">
            <NavbarBrand>
                <p className="font-bold text-inherit">AI Student Advisor</p>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="start">
                <NavbarItem isActive={currentPage === "home"}>
                    <Link href="/">Home</Link>
                </NavbarItem>
                <NavbarItem isActive={currentPage === "about"}>
                    <Link href="/about">About</Link>
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
                    <Dropdown
                        className={`${darkMode.isDarkMode ? "dark" : ""} text-foreground`}
                    >
                        <DropdownTrigger>
                            <Button
                                className={`${!darkMode.isDarkMode && "text-white"} font-bold`}
                                color="primary"
                            >
                                Welcome! {userID}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu color="primary">
                            <DropdownItem
                                color="secondary"
                                onPress={() => {
                                    navigate("/chat");
                                }}
                            >
                                Chat
                            </DropdownItem>
                            <DropdownItem
                                color="danger"
                                onClick={() => logOut()}
                            >
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
