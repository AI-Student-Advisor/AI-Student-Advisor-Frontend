import { Control, Message, SessionId } from "./interfaces/Common.ts";
import { PostRequest } from "./interfaces/Conversation.ts";
import {
    PostRequestSchema,
    PostResponseSchema
} from "./schemas/Conversation.ts";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { safeEvaluate } from "utils/Utils.ts";

type OnMessageCallback = (id: SessionId, message: Message) => void;
type OnControlCallback = (id: SessionId, control: Control) => void;

const endpoint = "/api/conversation";

export async function sendMessage(
    request: PostRequest,
    onMessage?: OnMessageCallback,
    onControl?: OnControlCallback,
    signal?: AbortSignal
) {
    const parsedRequest = PostRequestSchema.parse(request);

    await fetchEventSource(`${import.meta.env.VITE_API_ROOT}${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        signal: signal,
        openWhenHidden: true,
        body: JSON.stringify(parsedRequest),
        async onopen(response) {
            const contentType = response.headers.get("Content-Type");
            if (!contentType) {
                throw new TypeError("Server did not specify Content-Type");
            }

            if (
                // eslint-disable-next-line no-magic-numbers
                contentType.indexOf("text/event-stream") >= 0
            ) {
                return;
            }

            if (
                // eslint-disable-next-line no-magic-numbers
                contentType.indexOf("application/json") >= 0
            ) {
                throw await response.json();
            }

            throw new TypeError(`Unknown Content-Type: ${contentType}`);
        },
        onerror(error) {
            throw error;
        },
        onmessage(event) {
            const { data } = event;
            if (!data) {
                return;
            }

            const response = PostResponseSchema.parse(JSON.parse(data));
            switch (response.status) {
                case "success":
                    switch (response.type) {
                        case "message":
                            safeEvaluate(onMessage, [
                                response.id,
                                response.message
                            ]);
                            break;
                        case "control":
                            safeEvaluate(onControl, [
                                response.id,
                                response.control
                            ]);
                            break;
                    }
                    break;
                case "fail":
                    throw new Error(response.reason);
            }
        }
    });
}
