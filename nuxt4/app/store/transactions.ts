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

  const transaction = ref<SaleProps>();
  const $transaction = computed(() => transaction.value);

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

  const cancelTransaction = async (publicId: string) => {
    await api.put(`/transactions/cancel/${publicId}`);
  };

  const setSeller = async (input: { publicId: string; sellerId: number }) => {
    await api.put("/transactions/seller", input);
  };

  const show = async (publicId: string) => {
    const { data } = await api.get<SaleProps>(`/transactions/${publicId}`);
    transaction.value = data;
  };

  return {
    $transactions,
    $transaction,
    getTransactions,
    cancelTransaction,
    setSeller,
    show,
  };
});
