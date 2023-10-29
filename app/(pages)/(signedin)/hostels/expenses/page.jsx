import Expense from "@components/Expense/Expense";
import { getExpense } from "@/app/server_functions/Expense";
const Expenses = async () => {
  const { isError, data } = await getExpense();
  return <Expense data={data} />;
};

export default Expenses;
