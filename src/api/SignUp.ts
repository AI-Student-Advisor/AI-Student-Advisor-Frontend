import type { PostUserRequest } from "./interfaces/SignUp.ts";
import {
    PostUserRequestSchema,
    PostUserResponseSchema
} from "./schemas/SignUp.ts";

const endpoint = "/api/sign-up";

export async function signUp(request: PostUserRequest) {
    const parsedRequest = PostUserRequestSchema.parse(request);

    const response = await fetch(
        `${import.meta.env.VITE_API_ROOT}${endpoint}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(parsedRequest)
        }
    );

    const data = PostUserResponseSchema.parse(await response.json());
    if (data.status === "success") {
        return data;
    }
    throw new Error(data.reason);
}