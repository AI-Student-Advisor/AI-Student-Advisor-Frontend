import {
    GetRequestSchema,
    GetResponseSchema
} from "api/schemas/HistorySessions.ts";
import { z } from "zod";

export type GetRequest = z.infer<typeof GetRequestSchema>;
export type GetResponse = z.infer<typeof GetResponseSchema>;
