import * as z from "zod"
import { CompleteUserRoles, relatedUserRolesModel, CompleteHostel, relatedHostelModel } from "./index"

export const vendorModel = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().min(1, { message: "Email is must." }).email("This is not a valid email."),
  GSTIN: z.string().min(1, { message: "GSTIN is must." }),
  addressLine1: z.string(),
  addressLine2: z.string(),
  pincode: z.string(),
  district: z.string(),
  state: z.string(),
  country: z.string(),
  contact: z.string().min(1, { message: "Contact number is must." }).regex(new RegExp(/^\+?[1-9][0-9]{7,14}$/)),
  isActive: z.boolean(),
})

export interface CompleteVendor extends z.infer<typeof vendorModel> {
  UserRoles: CompleteUserRoles[]
  Hostel: CompleteHostel[]
}

/**
 * relatedVendorModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedVendorModel: z.ZodSchema<CompleteVendor> = z.lazy(() => vendorModel.extend({
  UserRoles: relatedUserRolesModel.array(),
  Hostel: relatedHostelModel.array(),
}))
