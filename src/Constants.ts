/* eslint-disable no-magic-numbers */
import { PasswordSchema } from "./api/schemas/Common.ts";

export const CHAT_HISTORY_SESSION_ENTRY_LIMIT = 50;
export const LOGIN_SUCCESS_MODAL_SHOW_DURATION_MS = 3000;

export const PASSWORD_MINIMUM_LENGTH = PasswordSchema.minLength!;

export const JWT_VERIFY_CLOCK_TOLERANCE = 5 * 60;
export const JWT_VERIFY_ISSUER = "AI Student Advisor";
