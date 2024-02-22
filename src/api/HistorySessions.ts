import { HistorySession } from "./interfaces/Common.ts";
import { GetRequest } from "./interfaces/HistorySessions.ts";
import {
    GetRequestSchema,
    GetResponseSchema
} from "./schemas/HistorySessions.ts";
import { toQueryString } from "utils/Utils.tsx";

const apiEndpoint = "/api/history-sessions";

export async function fetchHistorySessions(
    request: GetRequest
): Promise<Array<HistorySession>> {
    const parsedRequest = GetRequestSchema.parse(request);

    const response = await fetch(
        `${import.meta.env.VITE_API_ROOT}${apiEndpoint}${toQueryString(parsedRequest, true)}`
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
