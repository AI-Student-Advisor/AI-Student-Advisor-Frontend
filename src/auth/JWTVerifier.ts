import { camelToUpper } from "../utils/Utils.ts";
import { AuthPayload } from "./interfaces/AuthPayload.ts";
import { AuthPayloadSchema } from "./schemas/AuthPayload.ts";
import { importSPKI, jwtVerify, type JWTVerifyOptions } from "jose";
import { z } from "zod";

const JWTEnvConfigSchema = z.object({
    // eslint-disable-next-line no-magic-numbers
    publicKey: z.string().trim().min(1)
});

export class JWTVerifier {
    private readonly publicKey: string;
    private readonly verifyOptions: JWTVerifyOptions | undefined;

    constructor(verifyOptions?: JWTVerifyOptions) {
        const { publicKey } = parseJWTEnvConfig();
        this.publicKey = publicKey.replaceAll("\\n", "\n");
        this.verifyOptions = verifyOptions;
    }

    async decode(token: string) {
        const publicKey = await importSPKI(
            this.publicKey,
            this.verifyOptions?.algorithms?.at(0) || "ES256"
        );
        const verifyResult = await jwtVerify(
            token,
            publicKey,
            this.verifyOptions
        );

        const authPayload = verifyResult.payload as AuthPayload;
        return AuthPayloadSchema.parse(authPayload);
    }
}

function parseJWTEnvConfig() {
    const config: Record<string, string> = {};

    for (const key in JWTEnvConfigSchema.shape) {
        if (!Object.hasOwn(JWTEnvConfigSchema.shape, key)) {
            continue;
        }
        config[key] = import.meta.env[`VITE_JWT_${camelToUpper(key)}`] ?? "";
    }

    return JWTEnvConfigSchema.parse(config);
}
