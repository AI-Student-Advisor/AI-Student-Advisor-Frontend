import type { PageProps } from "./interfaces/PageProps.ts";
import { faEllipsis, faPenFancy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, ScrollShadow } from "@nextui-org/react";
import { CHAT_HISTORY_SESSION_ENTRY_LIMIT } from "Constants.ts";
import { sendMessage } from "api/Conversation.ts";
import {
    deleteHistorySession,
    fetchHistorySession,
    renameHistorySession
} from "api/HistorySession.ts";
import { fetchHistorySessions } from "api/HistorySessions.ts";
import {
    Control,
    HistorySession,
    Message,
    SessionId
} from "api/interfaces/Common.ts";
import ChatInput, { ChatInputStatus } from "components/ChatInput.tsx";
import ChatSession from "components/ChatSession.tsx";
import ChatSessionHistory from "components/ChatSessionHistory.tsx";
import ChatToolbar from "components/ChatToolbar.tsx";
import { useEffect, useRef, useState } from "react";

export interface ChatProps extends PageProps {}

export default function Chat({
    darkMode,
    token,
    jwt,
    ...otherProps
}: ChatProps) {
    const [inputStatus, setInputStatus] = useState<ChatInputStatus>("idle");
    const [inputValue, setInputValue] = useState("");
    const [historySessions, setHistorySessions] = useState<HistorySession[]>(
        []
    );
    const [messages, setMessages] = useState<Message[]>([]);
    const [loadingSessions, setLoadingSessions] = useState(true);
    const [activeSessionId, setActiveSessionId] = useState<
        SessionId | undefined
    >(undefined);
    const [activeSessionTitle, setActiveSessionTitle] =
        useState<string>("New Chat");
    const generationController = useRef<AbortController>(new AbortController());
    const chatSessionScrollComponent = useRef<HTMLDivElement>(null);

    useEffect(() => {
        void (async () => {
            const sessions = await fetchHistorySessions(
                {
                    offset: 0,
                    limit: CHAT_HISTORY_SESSION_ENTRY_LIMIT
                },
                token
            );
            setHistorySessions(sessions);
            setLoadingSessions(false);
        })();
    });

    useEffect(() => {
        const component = chatSessionScrollComponent.current;
        if (component) {
            component.scroll({
                top: component.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [messages]);

    async function handleLoadMore() {
        setLoadingSessions(true);
        try {
            const sessions = await fetchHistorySessions(
                {
                    offset: historySessions.length,
                    limit: CHAT_HISTORY_SESSION_ENTRY_LIMIT
                },
                token
            );
            setHistorySessions([...historySessions, ...sessions]);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingSessions(false);
        }
    }

    function handleNewChat() {
        setActiveSessionId(undefined);
        setActiveSessionTitle("New Chat");
        setMessages([]);
    }

    async function handleSelect(session: HistorySession) {
        const messages = await fetchHistorySession(
            {
                id: session.id
            },
            token
        );
        setActiveSessionId(session.id);
        setActiveSessionTitle(session.title);
        setMessages(messages);
    }

    async function handleRename(session: HistorySession, newName: string) {
        await renameHistorySession({ id: session.id, name: newName }, token);
        setHistorySessions((prevState) =>
            prevState.map((value) => {
                if (value.id === session.id) {
                    value.title = newName;
                }
                return value;
            })
        );
        if (session.id === activeSessionId) {
            setActiveSessionTitle(newName);
        }
    }

    async function handleDelete(session: HistorySession) {
        await deleteHistorySession({ id: session.id }, token);
        setHistorySessions((prevState) =>
            prevState.filter((value) => value.id !== session.id)
        );
        handleNewChat();
    }

    function handleSendMessage(text: string) {
        setInputStatus("waiting");
        generationController.current = new AbortController();

        const message: Message = {
            id: crypto.randomUUID(),
            content: text,
            author: {
                role: "user"
            }
        };

        // Append user sent message
        setMessages((prevMessages) => [...prevMessages, message]);

        void sendMessage(
            { id: activeSessionId, message: message },
            token,
            handleMessage,
            handleControl,
            generationController.current.signal
        ).catch((error) => {
            console.error(error);
            handleError(error);
        });
    }

    function handleMessage(id: SessionId, message: Message) {
        setActiveSessionId(id);

        setMessages((prevMessages) => {
            /* eslint-disable no-magic-numbers */
            if (
                prevMessages.length > 0 &&
                prevMessages[prevMessages.length - 1].id === message.id
            ) {
                return [...prevMessages.slice(0, -1), message];
            }
            /* eslint-enable no-magic-numbers */
            return [...prevMessages, message];
        });
    }

    function handleControl(_: SessionId, control: Control) {
        let errorString = "";

        switch (control.signal) {
            case "generation-pending":
                setInputStatus("pending");
                break;
            case "generation-started":
                setInputStatus("generating");
                break;
            case "generation-done":
                setInputStatus("idle");
                setInputValue("");
                break;
            case "generation-error":
                errorString = "Signal generation-error received";
                console.error(errorString);
                handleError(errorString);
                break;
        }
    }

    // eslint-disable-next-line
    function handleError(error: any | object | string) {
        // TODO: Need more user-friendly error prompt
        const message: Message = {
            id: crypto.randomUUID(),
            content: error.toString(),
            author: {
                role: "system"
            }
        };
        setMessages((prevMessages) => [...prevMessages, message]);
        setInputStatus("idle");
    }

    function handleStopGenerate() {
        generationController.current.abort();
        setInputStatus("idle");
    }

    return (
        <div className="h-full flex" {...otherProps}>
            <div className="flex flex-col min-w-64 p-3 bg-secondary-50">
                <Button
                    variant="solid"
                    color="primary"
                    className="text-white text-lg font-bold w-full min-h-12"
                    size="lg"
                    startContent={<FontAwesomeIcon icon={faPenFancy} />}
                    onPress={handleNewChat}
                >
                    New Chat
                </Button>
                <div role="separator" className="py-3"></div>
                <ScrollShadow className="h-full flex-1">
                    <ChatSessionHistory
                        isDarkMode={darkMode.isDarkMode}
                        historySessions={historySessions}
                        onSelectSession={handleSelect}
                        onRenameSession={handleRename}
                        onDeleteSession={handleDelete}
                        selectedSessionId={activeSessionId}
                    />
                </ScrollShadow>
                <div role="separator" className="py-3"></div>
                <Button
                    isLoading={loadingSessions}
                    variant="solid"
                    color="secondary"
                    className="text-white text-lg font-bold w-full min-h-12"
                    size="lg"
                    startContent={
                        loadingSessions ? (
                            <></>
                        ) : (
                            <FontAwesomeIcon icon={faEllipsis} />
                        )
                    }
                    onPress={handleLoadMore}
                >
                    {loadingSessions ? "Loading" : "Load More"}
                </Button>
            </div>
            <div className="flex flex-col flex-1 items-center">
                <ChatToolbar
                    darkMode={darkMode}
                    title={activeSessionTitle}
                    className="sticky top-0 w-full pt-2 px-4 min-h-14 flex justify-between items-center"
                />
                <ScrollShadow
                    ref={chatSessionScrollComponent}
                    className="px-4 w-[56rem] h-full"
                >
                    <ChatSession messages={messages} />
                </ScrollShadow>
                <ChatInput
                    value={inputValue}
                    setValue={setInputValue}
                    className="pb-4 w-[64rem] flex items-center"
                    onSendMessage={handleSendMessage}
                    onStopGenerate={handleStopGenerate}
                    status={inputStatus}
                />
            </div>
        </div>
    );
}
