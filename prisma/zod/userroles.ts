import * as z from "zod"
import { CompleteUser, relatedUserModel, CompleteVendor, relatedVendorModel, CompleteHostel, relatedHostelModel, CompleteRoles, relatedRolesModel } from "./index"

export const userRolesModel = z.object({
  id: z.string(),
  roleId: z.string(),
  userId: z.string(),
  vendorId: z.string().nullish(),
  hostelId: z.string().nullish(),
  isActive: z.boolean().nullish(),
  created: z.date(),
  expired: z.date().nullish(),
})

export interface CompleteUserRoles extends z.infer<typeof userRolesModel> {
  user: CompleteUser
  vendor?: CompleteVendor | null
  hostel?: CompleteHostel | null
  role: CompleteRoles
}

/**
 * relatedUserRolesModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedUserRolesModel: z.ZodSchema<CompleteUserRoles> = z.lazy(() => userRolesModel.extend({
  user: relatedUserModel,
  vendor: relatedVendorModel.nullish(),
  hostel: relatedHostelModel.nullish(),
  role: relatedRolesModel,
}))
