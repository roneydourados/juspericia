import { defineStore } from "pinia";

export const useAdminDashboardSalesStore = defineStore(
  "adminDashboardSales",
  () => {
    const { api } = useAxios();
    const dashboard = ref<SalesAdminDashboardProps>();

    const $dashboard = computed(() => dashboard.value);

    const index = async ({
      finalDate,
      initialDate,
      ufs,
    }: AdminDashBoardSalesFilterProps) => {
      const config = {
        params: {
          finalDate,
          initialDate,
          ufs: JSON.stringify(ufs),
        },
      };
      const { data } = await api.get<SalesAdminDashboardProps>(
        "/admin/dashboard-sales",
        config
      );

      dashboard.value = data;
    };

    return {
      $dashboard,
      index,
    };
  }
);
