import {
    PostUserRequestSchema,
    PostUserResponseSchema
} from "../schemas/SignUpSession.ts";
import { z } from "zod";

export type PostUserRequest = z.infer<typeof PostUserRequestSchema>;
export type PostUserResponse = z.infer<typeof PostUserResponseSchema>;
