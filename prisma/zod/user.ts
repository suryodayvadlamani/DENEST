import * as z from "zod"
import { CompleteAccount, relatedAccountModel, CompleteSession, relatedSessionModel, CompleteUserRoles, relatedUserRolesModel, CompleteTenantRoom, relatedTenantRoomModel, CompleteRentCollection, relatedRentCollectionModel, CompleteDues, relatedDuesModel, CompleteTenantPay, relatedTenantPayModel } from "./index"

export const userModel = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "Name is must." }).nullish(),
  password: z.string().nullish(),
  email: z.string().min(1, { message: "Email is must." }).email("This is not a valid email.").nullish(),
  emailVerified: z.date().nullish(),
  image: z.string().nullish(),
  aadhar: z.string().min(1, { message: "Aadhar is must." }).nullish(),
  profession: z.string().nullish(),
  addressLine1: z.string().nullish(),
  addressLine2: z.string().nullish(),
  pinCode: z.string().nullish(),
  district: z.string().nullish(),
  state: z.string().nullish(),
  country: z.string().nullish(),
  contact: z.string().min(1, { message: "Contact number is must." }).regex(new RegExp(/^\+?[1-9][0-9]{7,14}$/)).nullish(),
  createdDate: z.date(),
  isActive: z.boolean(),
})

export interface CompleteUser extends z.infer<typeof userModel> {
  accounts: CompleteAccount[]
  sessions: CompleteSession[]
  UserRoles: CompleteUserRoles[]
  UserRoom: CompleteTenantRoom[]
  RentCollection: CompleteRentCollection[]
  dues: CompleteDues[]
  TenantPay: CompleteTenantPay[]
}

/**
 * relatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() => userModel.extend({
  accounts: relatedAccountModel.array(),
  sessions: relatedSessionModel.array(),
  UserRoles: relatedUserRolesModel.array(),
  UserRoom: relatedTenantRoomModel.array(),
  RentCollection: relatedRentCollectionModel.array(),
  dues: relatedDuesModel.array(),
  TenantPay: relatedTenantPayModel.array(),
}))
