import { z } from "zod";

const configSchema = z.object({
    independentRequestAgeThreshold: z.coerce.number().default(16),
});

export const appConfig = configSchema.parse({
    independentRequestAgeThreshold: process.env.INDEPENDENT_REQUEST_AGE_THRESHOLD,
});
