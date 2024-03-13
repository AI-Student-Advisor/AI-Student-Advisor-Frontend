import { MSG_TYPE } from "../Constants";

interface ResponseMsgProps {
    type: MSG_TYPE;
    content: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
}

export default function ResponseMsg({
    type,
    content,
    setMessage
}: ResponseMsgProps) {
    let messageClass = "";
    switch (type) {
        case MSG_TYPE.Info:
            messageClass = "alert-info";
            break;
        case MSG_TYPE.Success:
            messageClass = "alert-success";
            break;
        case MSG_TYPE.Error:
            messageClass = "alert-danger";
            break;
        default:
            return <></>;
    }
    if (content === "") {
        return <div></div>;
    }

    const classNameStr = `alert alert-dismissible fade show ${messageClass}`;
    return (
        <div className={classNameStr}>
            {content}
            <button
                className="btn-close"
                data-bs-dismiss="alert"
                onClick={() => setMessage("")}
            ></button>
        </div>
    );
}
