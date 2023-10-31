import * as z from "zod"
import { CompleteUser, relatedUserModel, CompleteBed, relatedBedModel } from "./index"

export const tenantRoomModel = z.object({
  id: z.string(),
  rent: z.number().int(),
  advance: z.number().int(),
  isActive: z.boolean(),
  userId: z.string(),
  bedId: z.string(),
  startDate: z.date(),
  endDate: z.date(),
})

export interface CompleteTenantRoom extends z.infer<typeof tenantRoomModel> {
  user: CompleteUser
  bed: CompleteBed
}

/**
 * relatedTenantRoomModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedTenantRoomModel: z.ZodSchema<CompleteTenantRoom> = z.lazy(() => tenantRoomModel.extend({
  user: relatedUserModel,
  bed: relatedBedModel,
}))
