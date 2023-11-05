import Expense from "@components/Expense/Expense";
import { getExpense } from "@/app/server_functions/Expense";
import { getHostels } from "@/app/server_functions/Hostels";
const Expenses = async () => {
  const { isError, data } = await getExpense();
  const { data: hostelsData } = await getHostels();
  return <Expense data={data} hostelsData={hostelsData} />;
};

export default Expenses;
