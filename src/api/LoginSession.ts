import { GetUserRequest } from "./interfaces/LoginSession.ts";
import {
    GetUserRequestSchema,
    GetUserResponseSchema
} from "./schemas/LoginSession.ts";
import { toQueryString } from "utils/Utils.ts";

const apiEndpoint = "/api/login";

export async function fetchUserSession(request: GetUserRequest) {
    const { username, password, ...parsedRequest } =
        GetUserRequestSchema.parse(request);

    const response = await fetch(
        `${import.meta.env.VITE_API_ROOT}${apiEndpoint}?username=${username}&password=${password}${toQueryString(parsedRequest, false)}`
    );
    const data = GetUserResponseSchema.parse(await response.json());
    return data;
}
