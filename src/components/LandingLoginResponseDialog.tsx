import { LandingLoginModalMessageType } from "./LandingLoginModal.tsx";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";

interface LandingLoginResponseDialogProps {
    type: LandingLoginModalMessageType;
    content: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    handler?: () => void;
    isDarkMode: boolean;
}

export default function LandingLoginResponseDialog({
    type,
    content,
    setMessage,
    handler,
    isDarkMode
}: LandingLoginResponseDialogProps) {
    let fontColor = "";
    let title = "";
    switch (type) {
        case "info":
            fontColor = "text-primary";
            title = "Notice";
            break;
        case "success":
            fontColor = "text-success";
            title = "Success";
            break;
        case "error":
            fontColor = "text-danger";
            title = "Error";
            break;
        default:
            return <></>;
    }
    if (content === "") {
        return <div></div>;
    }
    return (
        <Modal
            className={`${isDarkMode ? "dark" : ""} text-foreground`}
            isOpen={content !== ""}
            onOpenChange={() => {
                setMessage("");
                if (type === "success" && handler) {
                    handler();
                }
            }}
        >
            <ModalContent>
                <ModalHeader className={`flex flex-col gap-1 ${fontColor}`}>
                    {title}
                </ModalHeader>
                <ModalBody>{content}</ModalBody>
            </ModalContent>
        </Modal>
    );
}
