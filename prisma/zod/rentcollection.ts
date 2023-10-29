import * as z from "zod"
import { CompleteUser, relatedUserModel } from "./index"

export const rentCollectionModel = z.object({
  id: z.string(),
  userId: z.string(),
  collectedDate: z.date(),
})

export interface CompleteRentCollection extends z.infer<typeof rentCollectionModel> {
  user: CompleteUser
}

/**
 * relatedRentCollectionModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedRentCollectionModel: z.ZodSchema<CompleteRentCollection> = z.lazy(() => rentCollectionModel.extend({
  user: relatedUserModel,
}))
