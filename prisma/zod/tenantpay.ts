import * as z from "zod"
import { TenantPay_Type } from "@prisma/client"
import { CompleteUser, relatedUserModel } from "./index"

export const tenantPayModel = z.object({
  id: z.string(),
  userId: z.string(),
  amount: z.number().int().min(1, { message: "Amount is must." }).nullish(),
  paidDate: z.date(),
  startDate: z.date(),
  endDate: z.date(),
  paymentType: z.nativeEnum(TenantPay_Type),
})

export interface CompleteTenantPay extends z.infer<typeof tenantPayModel> {
  user: CompleteUser
}

/**
 * relatedTenantPayModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedTenantPayModel: z.ZodSchema<CompleteTenantPay> = z.lazy(() => tenantPayModel.extend({
  user: relatedUserModel,
}))
