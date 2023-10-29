import * as z from "zod"
import { CompleteUserRoles, relatedUserRolesModel, CompleteHostel, relatedHostelModel } from "./index"

export const vendorModel = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  GSTIN: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string(),
  pincode: z.string(),
  district: z.string(),
  state: z.string(),
  country: z.string(),
  contact: z.string(),
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
