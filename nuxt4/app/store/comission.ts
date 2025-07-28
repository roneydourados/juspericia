import { defineStore } from "pinia";

export const useComissionStore = defineStore("comission", () => {
  const { api } = useAxios();

  const comissions = ref<ComissionProps[]>([]);
  const comission = ref<ComissionProps>();
  const $all = computed(() => comissions.value);
  const $single = computed(() => comission.value);

  const index = async (filters: {
    initialDate: string;
    finalDate: string;
    userId?: number;
    comissionType?: string;
    status?: string;
  }) => {
    const { initialDate, finalDate, userId, comissionType, status } = filters;
    const config = {
      params: {
        initialDate,
        finalDate,
        userId,
        comissionType,
        status,
      },
    };

    const { data } = await api.get("/comission", config);
    comissions.value = data;
  };

  const show = async (publicId: string) => {
    const { data } = await api.get(`/comission/${publicId}`);
    comission.value = data;
  };

  const create = async (payload: ComissionProps) => {
    const { data } = await api.post<ComissionProps>("/comission", payload);
    comission.value = data;
  };

  const update = async (payload: ComissionProps) => {
    const { data } = await api.put<ComissionProps>("/comission", payload);
    comission.value = data;
  };

  const paidComission = async (publicId: string) => {
    await api.put(`/comission-paid/${publicId}`);
  };

  const cancelComission = async (publicId: string) => {
    await api.put(`/comission-cancel/${publicId}`);
  };

  const clear = () => {
    comissions.value = [];
    comission.value = undefined;
  };

  return {
    $all,
    $single,
    index,
    show,
    create,
    update,
    paidComission,
    cancelComission,
    clear,
  };
});
