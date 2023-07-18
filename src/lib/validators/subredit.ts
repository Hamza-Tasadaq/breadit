
import { z } from "zod";

export const SubreditValidator = z.object({
    name: z.string().min(3).max(21)
});

export const SubreditSubscriptionValidator = z.object({
    subredditId: z.string()
});

export type CreateSubreditPayload = z.infer<typeof SubreditValidator>;
export type CreateSubreditSubscriptionPayload = z.infer<typeof SubreditSubscriptionValidator>;