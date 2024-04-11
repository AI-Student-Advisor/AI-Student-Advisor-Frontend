import {
    PostUserRequestSchema,
    PostUserResponseSchema
} from "api/schemas/LogIn.ts";
import { z } from "zod";

export type PostUserRequest = z.infer<typeof PostUserRequestSchema>;
export type PostUserResponse = z.infer<typeof PostUserResponseSchema>;
