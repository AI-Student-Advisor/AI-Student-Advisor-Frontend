import {
    GetUserRequestSchema,
    GetUserResponseSchema
} from "../schemas/LoginSession.ts";
import { z } from "zod";

export type GetUserRequest = z.infer<typeof GetUserRequestSchema>;
export type GetUserResponse = z.infer<typeof GetUserResponseSchema>;
