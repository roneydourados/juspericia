import { defineStore } from "pinia";

export const useVoucherStore = defineStore("voucher", () => {
  const { api } = useAxios();
  const voucher = ref<VoucherFormProps>();
  const voucherExists = ref<VoucherFormProps>();
  const vouchers = ref<VoucherFormProps[]>([]);
  const $single = computed(() => voucher.value);
  const $voucherExists = computed(() => voucherExists.value);

  const $all = computed(() => vouchers.value);

  const index = async ({
    initialDate,
    finalDate,
    sellerId,
    status,
  }: VoucherFilterProps) => {
    const config = {
      params: {
        initialDate,
        finalDate,
        sellerId,
        status,
      },
    };

    const { data } = await api.get<VoucherFormProps[]>("/voucher", config);

    vouchers.value = data;
  };

  const show = async (publicId: string) => {
    const { data } = await api.get<VoucherFormProps>(`/voucher/${publicId}`);

    voucher.value = data;
  };

  const existsInUse = async (voucherName: string) => {
    const { data } = await api.get<VoucherFormProps>(
      `/voucher-name/${voucherName}`
    );

    voucherExists.value = data;
  };

  const create = async (payload: VoucherFormProps) => {
    const { data } = await api.post<VoucherFormProps>("/voucher", payload);

    voucher.value = data;
  };

  const update = async (payload: VoucherFormProps) => {
    const { data } = await api.put<VoucherFormProps>("/voucher", payload);

    voucher.value = data;
  };

  const destroy = async (publicId: string) => {
    await api.delete(`/voucher/${publicId}`);
  };

  const clear = () => {
    voucher.value = undefined;
    voucherExists.value = undefined;
  };

  return {
    voucher,
    vouchers,
    $single,
    $all,
    $voucherExists,
    index,
    show,
    create,
    update,
    destroy,
    existsInUse,
    clear,
  };
});
