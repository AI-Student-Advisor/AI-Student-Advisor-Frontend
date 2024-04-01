import { PostUserRequest } from "./interfaces/SignUpSession";
import {
    PostUserRequestSchema,
    PostUserResponseSchema
} from "./schemas/SignUpSession";

const apiEndpoint = "/api/sign";

export async function signUpUserSession(
    request: PostUserRequest,
    signal?: AbortSignal
) {
    const parsedRequest = PostUserRequestSchema.parse(request);
    const source = `${import.meta.env.VITE_API_ROOT}${apiEndpoint}`;
    const body = JSON.stringify(parsedRequest);
    const response = await fetch(source, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        signal: signal,
        body: body
    });
    const data = PostUserResponseSchema.parse(await response.json());
    return data;
}
