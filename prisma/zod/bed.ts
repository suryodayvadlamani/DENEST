import * as z from "zod"
import { CompleteRoom, relatedRoomModel, CompleteTenantRoom, relatedTenantRoomModel } from "./index"

export const bedModel = z.object({
  id: z.string(),
  title: z.string(),
  isActive: z.boolean(),
  occupied: z.boolean(),
  roomId: z.string(),
})

export interface CompleteBed extends z.infer<typeof bedModel> {
  room: CompleteRoom
  UserRoom: CompleteTenantRoom[]
}

/**
 * relatedBedModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedBedModel: z.ZodSchema<CompleteBed> = z.lazy(() => bedModel.extend({
  room: relatedRoomModel,
  UserRoom: relatedTenantRoomModel.array(),
}))
