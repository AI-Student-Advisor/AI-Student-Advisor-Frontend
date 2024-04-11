import { HistorySession } from "./interfaces/Common.ts";
import { GetRequest } from "./interfaces/HistorySessions.ts";
import {
    GetRequestSchema,
    GetResponseSchema
} from "./schemas/HistorySessions.ts";
import { toQueryString } from "utils/Utils.ts";

const endpoint = "/api/history-sessions";

export async function fetchHistorySessions(
    request: GetRequest,
    token: string
): Promise<Array<HistorySession>> {
    const parsedRequest = GetRequestSchema.parse(request);

    const response = await fetch(
        `${import.meta.env.VITE_API_ROOT}${endpoint}${toQueryString(parsedRequest, true)}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    const data = GetResponseSchema.parse(await response.json());

    switch (data.status) {
        case "success":
            return data.items;
        case "fail":
            throw new Error(data.reason);
        default:
            // Just here to make the linter happy...
            return [];
    }
}
