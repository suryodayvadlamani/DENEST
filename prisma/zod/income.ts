import * as z from "zod"
import { CompleteHostel, relatedHostelModel } from "./index"

export const incomeModel = z.object({
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
  amount: z.number().int().min(1, { message: "Amount is must." }).nullish(),
  days: z.number().int().nullish(),
  isActive: z.boolean(),
  hostelId: z.string(),
})

export interface CompleteIncome extends z.infer<typeof incomeModel> {
  hostel: CompleteHostel
}

/**
 * relatedIncomeModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedIncomeModel: z.ZodSchema<CompleteIncome> = z.lazy(() => incomeModel.extend({
  hostel: relatedHostelModel,
}))
