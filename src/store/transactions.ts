import { defineStore } from "pinia";

interface FilterProps {
  initialDate: string;
  finalDate: string;
  status?: string;
  userId?: number;
  sellerId?: number;
}

export const useTransactionsStore = defineStore("transactions", () => {
  const { api } = useAxios();
  const transactions = ref<TransactionProps[]>([]);
  const $transactions = computed(() => transactions.value);

  const getTransactions = async ({
    initialDate,
    finalDate,
    userId,
    sellerId,
    status,
  }: FilterProps) => {
    const config = {
      params: {
        initialDate,
        finalDate,
        userId,
        sellerId,
        status,
      },
    };

    const { data } = await api.get<TransactionProps[]>("/transactions", config);

    transactions.value = data;
  };

  return { $transactions, getTransactions };
});
