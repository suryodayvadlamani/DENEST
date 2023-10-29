import * as z from "zod";
import {
  CompleteHostel,
  relatedHostelModel,
  CompleteBed,
  relatedBedModel,
} from "./index";

enum Room_Type {
  AC = "AC",
  NON_AC = "NON_AC",
}

export const roomModel = z.object({
  id: z.string(),
  title: z.string(),
  capacity: z.coerce.number().int(),
  isActive: z.boolean(),
  roomType: z.nativeEnum(Room_Type),
  hostelId: z.string(),
  floorId: z.string(),
});

export interface CompleteRoom extends z.infer<typeof roomModel> {
  hostel: CompleteHostel;
  Beds: CompleteBed[];
}

/**
 * relatedRoomModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedRoomModel: z.ZodSchema<CompleteRoom> = z.lazy(() =>
  roomModel.extend({
    hostel: relatedHostelModel,
    Beds: relatedBedModel.array(),
  })
);
