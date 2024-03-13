import {
    DeleteRequest,
    GetRequest,
    PatchRequest
} from "./interfaces/HistorySession.ts";
import {
    DeleteRequestSchema,
    DeleteResponseSchema,
    GetRequestSchema,
    GetResponseSchema,
    PatchRequestSchema,
    PatchResponseSchema
} from "./schemas/HistorySession.ts";
import { toQueryString } from "utils/Utils.ts";

const endpoint = "/api/history-session";

export async function fetchHistorySession(request: GetRequest) {
    const { id, ...parsedRequest } = GetRequestSchema.parse(request);

    const response = await fetch(
        `${import.meta.env.VITE_API_ROOT}${endpoint}/${id}${toQueryString(parsedRequest, true)}`
    );
    const data = GetResponseSchema.parse(await response.json());

    switch (data.status) {
        case "success":
            return data.messages;
        case "fail":
            throw new Error(data.reason);
        default:
            // Just here to make the linter happy...
            return [];
    }
}

export async function renameHistorySession(request: PatchRequest) {
    const { id, ...parsedRequest } = PatchRequestSchema.parse(request);

    const response = await fetch(
        `${import.meta.env.VITE_API_ROOT}${endpoint}/${id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(parsedRequest)
        }
    );
    const data = PatchResponseSchema.parse(await response.json());

    switch (data.status) {
        case "success":
            return;
        case "fail":
            throw new Error(data.reason);
    }
}

export async function deleteHistorySession(request: DeleteRequest) {
    const { id, ...parsedRequest } = DeleteRequestSchema.parse(request);

    const response = await fetch(
        `${import.meta.env.VITE_API_ROOT}${endpoint}/${id}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(parsedRequest)
        }
    );
    const data = DeleteResponseSchema.parse(await response.json());

    switch (data.status) {
        case "success":
            return;
        case "fail":
            throw new Error(data.reason);
    }
}
