import { MSG_TYPE } from "../Constants";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";

interface ResponseMsgProps {
    type: MSG_TYPE;
    content: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    handler?: () => void;
}

export default function ResponseMsg({
    type,
    content,
    setMessage,
    handler
}: ResponseMsgProps) {
    let fontColor = "";
    let title = "";
    switch (type) {
        case MSG_TYPE.Info:
            fontColor = "text-primary";
            title = "Notice";
            break;
        case MSG_TYPE.Success:
            fontColor = "text-success";
            title = "Success";
            break;
        case MSG_TYPE.Error:
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
            isOpen={content !== ""}
            onOpenChange={() => (
                setMessage(""),
                type === MSG_TYPE.Success && handler && handler()
            )}
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
