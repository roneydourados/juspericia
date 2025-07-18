import { defineStore } from "pinia";

export const useSaleStore = defineStore("sale", () => {
  const { api } = useAxios();
  const sale = ref<SaleProps>();
  const sales = ref<SaleProps[]>([]);
  const $single = computed(() => sale.value);
  const $all = computed(() => sales.value);

  const create = async (payload: SaleProps) => {
    const { data } = await api.post<SaleProps>("/sale", payload);
    sale.value = data;
  };

  const update = async (payload: SaleProps) => {
    const { data } = await api.put<SaleProps>("/sale", payload);
    sale.value = data;
  };

  const show = async (publicId: string) => {
    const { data } = await api.get<SaleProps>(`/sale/${publicId}`);
    sale.value = data;
  };

  const getSalesUser = async (input: {
    userId: number;
    initialDate: string;
    finalDate: string;
    status?: string;
    saleType?: string;
  }) => {
    const { userId, initialDate, finalDate, status, saleType } = input;
    const config = {
      params: {
        userId,
        initialDate,
        finalDate,
        status,
        saleType,
      },
    };

    const { data } = await api.get<SaleProps[]>(`/sales-user`, config);
    sales.value = data;
  };

  return {
    create,
    update,
    show,
    getSalesUser,
    $single,
    $all,
  };
});
