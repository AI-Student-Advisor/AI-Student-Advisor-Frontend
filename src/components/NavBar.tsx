import NavBarLoginModal from "./NavBarLoginModal.tsx";
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
    type NavbarProps,
    Switch,
    useDisclosure
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import type { useDarkMode } from "usehooks-ts";

interface NavBarProps extends NavbarProps {
    onLogIn: (token: string) => void;
    onLogOut: () => void;
    displayName: string;
    darkMode: ReturnType<typeof useDarkMode>;
    currentPage: "home" | "about";
}

export default function NavBar({
    onLogIn,
    onLogOut,
    displayName,
    darkMode,
    currentPage,
    ...otherProps
}: NavBarProps) {
    const {
        isOpen: isModalOpen,
        onOpen: openModal,
        onOpenChange: onModalOpenChange
    } = useDisclosure();

    const navigate = useNavigate();

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
                {displayName === "" && (
                    <Button
                        className="hidden lg:flex"
                        variant="flat"
                        color="primary"
                        onClick={openModal}
                    >
                        Log In & Sign Up
                    </Button>
                )}
                {displayName !== "" && (
                    <Dropdown
                        className={`${darkMode.isDarkMode ? "dark" : ""} text-foreground`}
                    >
                        <DropdownTrigger>
                            <Button
                                className={`${!darkMode.isDarkMode && "text-white"} font-bold`}
                                color="primary"
                            >
                                Welcome! {displayName}
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
                            <DropdownItem color="danger" onClick={onLogOut}>
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
            <NavBarLoginModal
                isOpen={isModalOpen}
                onOpenChange={onModalOpenChange}
                onLogIn={onLogIn}
                isDarkMode={darkMode.isDarkMode}
                children={null}
            />
        </Navbar>
    );
}
