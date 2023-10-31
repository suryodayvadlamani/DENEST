import * as z from "zod"
import { Room_Type } from "@prisma/client"
import { CompleteHostel, relatedHostelModel, CompleteBed, relatedBedModel } from "./index"

export const roomModel = z.object({
  id: z.string(),
  title: z.string(),
  capacity: z.number().int(),
  isActive: z.boolean(),
  roomType: z.nativeEnum(Room_Type),
  hostelId: z.string(),
  floorId: z.number().int(),
})

export interface CompleteRoom extends z.infer<typeof roomModel> {
  hostel: CompleteHostel
  Beds: CompleteBed[]
}

/**
 * relatedRoomModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedRoomModel: z.ZodSchema<CompleteRoom> = z.lazy(() => roomModel.extend({
  hostel: relatedHostelModel,
  Beds: relatedBedModel.array(),
}))
