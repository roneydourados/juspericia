import { defineStore } from "pinia";

export const useFinanceStore = defineStore("finance", () => {
  const { api } = useAxios();

  const expenses = ref<FinanceProps[]>([]);
  const expense = ref<FinanceProps>();

  const $all = computed(() => expenses.value);
  const $single = computed(() => expense.value);

  const index = async (filters: FinanceFiltersProps) => {
    const config = {
      params: {
        initialDate: filters.initialDate,
        finalDate: filters.finalDate,
        status: filters.status,
        financeType: filters.financeType,
      },
    };

    const { data } = await api.get<FinanceProps[]>("/finance", config);

    expenses.value = data;
  };

  const store = async (finance: FinanceProps) => {
    await api.post("/finance", finance);
  };

  const updated = async (finance: FinanceProps) => {
    await api.put(`/finance/${finance.publicId}`, finance);
  };

  const show = async (publicId: string) => {
    const { data } = await api.get<FinanceProps>(`/finance/${publicId}`);

    expense.value = data;
  };

  const downMany = async (payload: string[]) => {
    await api.post("/finance-down-many", { ids: payload });
  };

  return {
    $all,
    $single,
    index,
    store,
    updated,
    show,
    downMany,
  };
});
