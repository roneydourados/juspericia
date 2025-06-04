import { defineStore } from "pinia";

export const useUserAdminStore = defineStore("userAdmin", () => {
  const { api } = useAxios();

  const dashboard = ref<SalesAdminDashboardProps>();
  const user = ref<UserProps>();
  const users = ref<UserProps[]>([]);
  const dashboardInvoicing = ref<AdminDashboardInvoicingProps>();

  const $single = computed(() => user.value);
  const $all = computed(() => users.value);
  const $dashboard = computed(() => dashboard.value);
  const $dashboardInvoicing = computed(() => dashboardInvoicing.value);

  const index = async (inputQuery: string) => {
    const config = {
      params: {
        inputQuery,
      },
    };

    const { data } = await api.get<UserProps[]>("/user-admin", config);

    users.value = data;
  };

  const show = async (id: number) => {
    const { data } = await api.get<UserProps>(`/user-admin/${id}`);

    user.value = data;
  };

  const create = async (input: UserProps) => {
    const { data } = await api.post<UserProps>("/user-admin", input);

    user.value = data;
  };

  const update = async (input: UserProps) => {
    const { data } = await api.put<UserProps>("/user-admin", input);

    user.value = data;
  };

  const destroy = async (id: string) => {
    await api.delete(`/user-admin/${id}`);
  };

  const getDashboardSales = async ({
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
      "/user-admin/dashboard-sales",
      config
    );

    dashboard.value = data;
  };

  const getDashboardInvoicing = async ({
    initialDate,
    finalDate,
  }: AdminDashBoardSalesFilterProps) => {
    const config = {
      params: {
        initialDate,
        finalDate,
      },
    };
    const { data } = await api.get<AdminDashboardInvoicingProps>(
      "/user-admin-invoicing-sales",
      config
    );

    dashboardInvoicing.value = data;
  };

  return {
    $single,
    $all,
    $dashboard,
    $dashboardInvoicing,
    index,
    create,
    update,
    destroy,
    show,
    getDashboardSales,
    getDashboardInvoicing,
  };
});
