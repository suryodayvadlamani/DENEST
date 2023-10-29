import * as z from "zod";
import { CompleteUser, relatedUserModel } from "./index";
enum TenantPay_Type {
  CASH = "CASH",
  UPI = "UPI",
  CARD = "CARD",
}
export const tenantPayModel = z.object({
  id: z.string(),
  userId: z.string(),
  amount: z.coerce.number().int().nullish(),
  paidDate: z.date(),
  startDate: z.date(),
  endDate: z.date(),
  paymentType: z.nativeEnum(TenantPay_Type),
});

export interface CompleteTenantPay extends z.infer<typeof tenantPayModel> {
  user: CompleteUser;
}

/**
 * relatedTenantPayModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedTenantPayModel: z.ZodSchema<CompleteTenantPay> = z.lazy(
  () =>
    tenantPayModel.extend({
      user: relatedUserModel,
    })
);
