import { index } from "@/server/repositories/adminDashboardSalesRepository";
import { AdminDashBoardSalesFilterProps } from "~/types/AdminDashboardSales";

export default defineEventHandler(async (event) => {
  const { initialDate, finalDate, ufs } =
    getQuery<AdminDashBoardSalesFilterProps>(event);

  const ufsArray = ufs ? JSON.parse(String(ufs)) : undefined;

  setResponseStatus(event, 200);

  return index({
    initialDate,
    finalDate,
    ufs: ufsArray,
  });
});
