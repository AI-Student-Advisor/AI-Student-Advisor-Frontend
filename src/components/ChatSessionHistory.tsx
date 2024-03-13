import { faEllipsis, faFile, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Accordion,
    AccordionItem,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure
} from "@nextui-org/react";
import { HistorySession, SessionId } from "api/interfaces/Common.ts";
import React, { ReactElement, useEffect, useState } from "react";
import { safeEvaluate } from "utils/Utils.ts";

export type OnSelectSessionCallback = (
    session: HistorySession
) => Promise<void>;
export type OnDeleteSessionCallback = (
    session: HistorySession
) => Promise<void>;
export type OnRenameSessionCallback = (
    session: HistorySession,
    newName: string
) => Promise<void>;

export interface ChatSessionHistoryProps extends React.ComponentProps<"div"> {
    isDarkMode: boolean;
    historySessions: HistorySession[];
    onSelectSession?: OnSelectSessionCallback;
    onDeleteSession?: OnDeleteSessionCallback;
    onRenameSession?: OnRenameSessionCallback;
    selectedSessionId?: SessionId;
}

export default function ChatSessionHistory({
    isDarkMode,
    historySessions,
    onSelectSession,
    onDeleteSession,
    onRenameSession,
    selectedSessionId,
    ...otherProps
}: ChatSessionHistoryProps) {
    const [SessionDateView, setSessionDateView] = useState(
        new Map<string, HistorySession[]>()
    );

    useEffect(() => {
        const sessions = [...historySessions];
        sessions.sort(
            (a, b) =>
                new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
        );
        setSessionDateView(
            sessions.reduce((map, entry) => {
                const date = new Date(entry.dateTime);
                const localeDateString = date.toLocaleDateString();
                if (!map.has(localeDateString)) {
                    map.set(localeDateString, []);
                }
                map.get(localeDateString)!.push(entry);
                return map;
            }, new Map<string, HistorySession[]>())
        );
    }, [historySessions]);

    const [modalTargetSession, setModalTargetSession] =
        useState<HistorySession>();
    const [renameModalInputValue, setRenameModalInputValue] = useState("");
    const [renameInProgress, setRenameInProgress] = useState(false);
    const [deleteInProgress, setDeleteInProgress] = useState(false);
    const {
        isOpen: isRenameModalOpen,
        onOpen: openRenameModal,
        onOpenChange: onRenameModalOpenChange
    } = useDisclosure();

    const {
        isOpen: isDeleteModalOpen,
        onOpen: openDeleteModal,
        onOpenChange: onDeleteModalOpenChange
    } = useDisclosure();

    function createOnSelectHandler(session: HistorySession) {
        return () => safeEvaluate(onSelectSession, [session]);
    }

    function createOnDropdownActionHandler(session: HistorySession) {
        return (key: React.Key) => {
            switch (key as string) {
                case "rename":
                    setModalTargetSession(session);
                    setRenameModalInputValue("");
                    openRenameModal();
                    break;
                case "delete":
                    setModalTargetSession(session);
                    openDeleteModal();
                    break;
            }
        };
    }

    const accordionItems: ReactElement[] = [];
    SessionDateView.forEach((value, key) => {
        accordionItems.push(
            <AccordionItem title={key}>
                <SessionList key={key}>
                    {value.map((value) => (
                        <SessionEntry
                            isDarkMode={isDarkMode}
                            key={value.id}
                            onSelect={createOnSelectHandler(value)}
                            onDropdownAction={createOnDropdownActionHandler(
                                value
                            )}
                            selected={selectedSessionId === value.id}
                        >
                            {value.title}
                        </SessionEntry>
                    ))}
                </SessionList>
            </AccordionItem>
        );
    });

    async function handlePressRenameModalButton(onClose: () => void) {
        if (!onRenameSession || !renameModalInputValue || !modalTargetSession) {
            return;
        }

        setRenameInProgress(true);
        try {
            await onRenameSession(
                modalTargetSession,
                renameModalInputValue.trim()
            );
            onClose();
        } finally {
            setRenameInProgress(false);
        }
    }

    async function handlePressDeleteModalButton(onClose: () => void) {
        if (!onDeleteSession || !modalTargetSession) {
            return;
        }

        setDeleteInProgress(true);
        try {
            await onDeleteSession(modalTargetSession);
            onClose();
        } finally {
            setDeleteInProgress(false);
        }
    }

    return (
        <div {...otherProps}>
            <Accordion>{...accordionItems}</Accordion>
            <Modal
                isOpen={isRenameModalOpen}
                isDismissable={false}
                backdrop="opaque"
                onOpenChange={onRenameModalOpenChange}
                className={`${isDarkMode ? "dark" : ""} text-foreground`}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Rename the session to...
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    value={renameModalInputValue}
                                    onValueChange={setRenameModalInputValue}
                                ></Input>
                            </ModalBody>
                            <ModalFooter>
                                <Button onPress={onClose}>Close</Button>
                                <Button
                                    isLoading={renameInProgress}
                                    isDisabled={
                                        renameModalInputValue.trim() === ""
                                    }
                                    color="primary"
                                    onPress={() =>
                                        handlePressRenameModalButton(onClose)
                                    }
                                >
                                    Rename
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <Modal
                isOpen={isDeleteModalOpen}
                isDismissable={false}
                backdrop="blur"
                onOpenChange={onDeleteModalOpenChange}
                className={`${isDarkMode ? "dark" : ""} text-foreground`}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Delete the session?
                            </ModalHeader>
                            <ModalFooter>
                                <Button onPress={onClose}>Close</Button>
                                <Button
                                    isLoading={deleteInProgress}
                                    color="danger"
                                    onPress={() =>
                                        handlePressDeleteModalButton(onClose)
                                    }
                                >
                                    Delete
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}

interface SessionListProps extends React.ComponentProps<"ul"> {}

function SessionList({ children, ...otherProps }: SessionListProps) {
    return children ? <ul {...otherProps}>{children}</ul> : <></>;
}

interface SessionEntryProps extends React.ComponentProps<"li"> {
    isDarkMode: boolean;
    selected?: boolean;
    onSelect?: () => void;
    onDropdownAction?: (key: React.Key) => void;
}

function SessionEntry({
    isDarkMode,
    selected,
    onSelect,
    onDropdownAction,
    children,
    ...otherProps
}: SessionEntryProps) {
    return (
        <li
            className={`
                w-full
                flex items-center justify-between
            `}
            {...otherProps}
        >
            <div
                className={`
                    grow select-none rounded-2xl
                    mr-1
                    active:bg-secondary-400 hover:bg-secondary-200 my-0.5
                    px-3 py-2 cursor-pointer
                    ${selected ? "bg-secondary-300" : ""}
                `}
                onClick={onSelect}
            >
                {children}
            </div>
            <Dropdown className={`${isDarkMode ? "dark" : ""} text-foreground`}>
                <DropdownTrigger>
                    <Button isIconOnly size="sm" className="bg-opacity-30">
                        <FontAwesomeIcon icon={faEllipsis} />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Actions" onAction={onDropdownAction}>
                    <DropdownItem
                        key="rename"
                        startContent={<FontAwesomeIcon icon={faFile} />}
                    >
                        Rename
                    </DropdownItem>
                    <DropdownItem
                        key="delete"
                        className="text-danger"
                        startContent={<FontAwesomeIcon icon={faTrash} />}
                        color="danger"
                    >
                        Delete
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </li>
    );
}
