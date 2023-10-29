import * as z from "zod"
import { CompleteUser, relatedUserModel } from "./index"

export const duesModel = z.object({
  id: z.string(),
  userId: z.string(),
  amount: z.number().int(),
  createdBy: z.string(),
})

export interface CompleteDues extends z.infer<typeof duesModel> {
  user: CompleteUser
}

/**
 * relatedDuesModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedDuesModel: z.ZodSchema<CompleteDues> = z.lazy(() => duesModel.extend({
  user: relatedUserModel,
}))
