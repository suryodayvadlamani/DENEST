import * as z from "zod"
import { CompleteUserRoles, relatedUserRolesModel } from "./index"

export const rolesModel = z.object({
  id: z.string(),
  name: z.string(),
  isActive: z.boolean(),
})

export interface CompleteRoles extends z.infer<typeof rolesModel> {
  userRoles: CompleteUserRoles[]
}

/**
 * relatedRolesModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedRolesModel: z.ZodSchema<CompleteRoles> = z.lazy(() => rolesModel.extend({
  userRoles: relatedUserRolesModel.array(),
}))
