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
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Input,
    useDisclosure
} from "@nextui-org/react";
import { HistoryConversation, UUID } from "api/interfaces/CommonStruct.ts";
import React, { ReactElement, useEffect, useState } from "react";

export type OnSelectConversationCallback = (sessionId: UUID) => void;
export type OnDeleteConversationCallback = (sessionId: UUID) => void;
export type OnRenameConversationCallback = (
    sessionId: UUID,
    newName: string
) => void;

export interface ChatConversationHistoryProps
    extends React.ComponentProps<"div"> {
    isDarkMode: boolean;
    historyConversations: HistoryConversation[];
    onSelectConversation?: OnSelectConversationCallback;
    onDeleteConversation?: OnDeleteConversationCallback;
    onRenameConversation?: OnRenameConversationCallback;
    selectedSessionId?: UUID;
}

export default function ChatConversationHistory({
    isDarkMode,
    historyConversations,
    onSelectConversation,
    onDeleteConversation,
    onRenameConversation,
    selectedSessionId,
    ...otherProps
}: ChatConversationHistoryProps) {
    const [conversationMapIdView, setConversationMapIdView] = useState(
        new Map<string, HistoryConversation>()
    );
    const [conversationMapDateView, setConversationMapDateView] = useState(
        new Map<string, HistoryConversation[]>()
    );

    useEffect(() => {
        setConversationMapIdView(
            historyConversations.reduce((map, entry) => {
                map.set(entry.id, entry);
                return map;
            }, new Map<string, HistoryConversation>())
        );
    }, [historyConversations]);

    useEffect(() => {
        const conversations = Array.from(conversationMapIdView.values());
        conversations.sort(
            (a, b) =>
                new Date(b.dateTimeIso).getTime() -
                new Date(a.dateTimeIso).getTime()
        );
        setConversationMapDateView(
            conversations.reduce((map, entry) => {
                const date = new Date(entry.dateTimeIso);
                const localeDateString = date.toLocaleDateString();
                if (!map.has(localeDateString)) {
                    map.set(localeDateString, []);
                }
                map.get(localeDateString)!.push(entry);
                return map;
            }, new Map<string, HistoryConversation[]>())
        );
    }, [conversationMapIdView]);

    const [modalTargetId, setModalTargetId] = useState<UUID>();
    const [renameModalInputValue, setRenameModalInputValue] = useState("");
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

    function createOnSelectHandler(id: UUID) {
        return () => {
            if (onSelectConversation) {
                onSelectConversation(id);
            }
        };
    }

    function createOnDropdownActionHandler(id: UUID) {
        return (key: React.Key) => {
            switch (key as string) {
                case "rename":
                    setModalTargetId(id);
                    openRenameModal();
                    break;
                case "delete":
                    setModalTargetId(id);
                    openDeleteModal();
                    break;
            }
        };
    }

    const accordionItems: ReactElement[] = [];
    conversationMapDateView.forEach((value, key) => {
        accordionItems.push(
            <AccordionItem title={key}>
                <ConversationList key={key}>
                    {value.map((value) => (
                        <ConversationEntry
                            isDarkMode={isDarkMode}
                            key={value.id}
                            onSelect={createOnSelectHandler(value.id)}
                            onDropdownAction={createOnDropdownActionHandler(
                                value.id
                            )}
                            selected={selectedSessionId === value.id}
                        >
                            {value.title}
                        </ConversationEntry>
                    ))}
                </ConversationList>
            </AccordionItem>
        );
    });

    function handlePressRenameModalButton(onClose: () => void) {
        if (onRenameConversation && renameModalInputValue && modalTargetId) {
            onRenameConversation(modalTargetId, renameModalInputValue);
            onClose();
            setRenameModalInputValue("");
        }
    }

    function handlePressDeleteModalButton(onClose: () => void) {
        if (onDeleteConversation && modalTargetId) {
            onDeleteConversation(modalTargetId);
            onClose();
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
                                Rename the conversation to...
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
                                Delete the conversation?
                            </ModalHeader>
                            <ModalFooter>
                                <Button onPress={onClose}>Close</Button>
                                <Button
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

interface ConversationListProps extends React.ComponentProps<"ul"> {}

function ConversationList({ children, ...otherProps }: ConversationListProps) {
    return children ? <ul {...otherProps}>{children}</ul> : <></>;
}

interface ConversationEntryProps extends React.ComponentProps<"li"> {
    isDarkMode: boolean;
    selected?: boolean;
    onSelect?: () => void;
    onDropdownAction?: (key: React.Key) => void;
}

function ConversationEntry({
    isDarkMode,
    selected,
    onSelect,
    onDropdownAction,
    children,
    ...otherProps
}: ConversationEntryProps) {
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
