import * as z from "zod"
import { Expense_Type } from "@prisma/client"
import { CompleteHostel, relatedHostelModel } from "./index"

export const expenseModel = z.object({
  id: z.string(),
  expenseType: z.nativeEnum(Expense_Type),
  amount: z.number().int().min(1, { message: "Amount is must." }).nullish(),
  description: z.string().nullish(),
  expenseDate: z.date(),
  hostelId: z.string(),
})

export interface CompleteExpense extends z.infer<typeof expenseModel> {
  hostel: CompleteHostel
}

/**
 * relatedExpenseModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedExpenseModel: z.ZodSchema<CompleteExpense> = z.lazy(() => expenseModel.extend({
  hostel: relatedHostelModel,
}))
