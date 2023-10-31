import * as z from "zod"
import { CompleteVendor, relatedVendorModel, CompleteUserRoles, relatedUserRolesModel, CompleteExpense, relatedExpenseModel, CompleteRoom, relatedRoomModel } from "./index"

export const hostelModel = z.object({
  id: z.string(),
  name: z.string(),
  floors: z.number().int().min(1, { message: "Floors is must." }),
  addressLine1: z.string(),
  addressLine2: z.string(),
  pincode: z.string(),
  district: z.string(),
  state: z.string(),
  country: z.string(),
  contact: z.string(),
  vendorId: z.string().nullish(),
  isActive: z.boolean(),
})

export interface CompleteHostel extends z.infer<typeof hostelModel> {
  vendor?: CompleteVendor | null
  UserRoles: CompleteUserRoles[]
  Expense: CompleteExpense[]
  Rooms: CompleteRoom[]
}

/**
 * relatedHostelModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedHostelModel: z.ZodSchema<CompleteHostel> = z.lazy(() => hostelModel.extend({
  vendor: relatedVendorModel.nullish(),
  UserRoles: relatedUserRolesModel.array(),
  Expense: relatedExpenseModel.array(),
  Rooms: relatedRoomModel.array(),
}))
