import * as z from "zod";
import { CompleteHostel, relatedHostelModel } from "./index";

enum Expense_Type {
  UTILITY = "UTILITY",
  GROCERY = "GROCERY",
  VEGETABLES = "VEGETABLES",
  OTHERS = "OTHERS",
}

export const expenseModel = z.object({
  id: z.string(),
  expenseType: z.nativeEnum(Expense_Type),
  amount: z.coerce.number().int().nullish(),
  description: z.string().nullish(),
  expenseDate: z.date(),
  hostelId: z.string(),
});

export interface CompleteExpense extends z.infer<typeof expenseModel> {
  hostel: CompleteHostel;
}

/**
 * relatedExpenseModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedExpenseModel: z.ZodSchema<CompleteExpense> = z.lazy(() =>
  expenseModel.extend({
    hostel: relatedHostelModel,
  })
);
