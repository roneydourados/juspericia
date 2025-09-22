import { defineStore } from "pinia";

export const useUserIndicationStore = defineStore("userIndication", () => {
  const { api } = useAxios();

  const userIndication = ref<UserIndicationProps>();
  const userIndications = ref<UserIndicationProps[]>([]);

  const $all = computed(() => userIndications.value);
  const $single = computed(() => userIndication.value);

  const index = async (input: {
    initialDate: string;
    finalDate: string;
    status?: string;
    userId?: number;
  }) => {
    const config = {
      params: input,
    };
    const { data } = await api.get<UserIndicationProps[]>(
      "/user-indication",
      config
    );

    userIndications.value = data;
  };

  const create = async (payload: UserIndicationProps) => {
    const { data } = await api.post<UserIndicationProps>(
      "/user-indication",
      payload
    );

    userIndication.value = data;
  };

  const update = async (payload: UserIndicationProps) => {
    const { data } = await api.put<UserIndicationProps>(
      "/user-indication",
      payload
    );

    userIndication.value = data;
  };

  const destroy = async (publicId: string) => {
    await api.delete(`/user-indication/${publicId}`);
  };

  const show = async (publicId: string) => {
    const { data } = await api.delete(`/user-indication/${publicId}`);

    userIndication.value = data;
  };

  return {
    $all,
    $single,
    index,
    create,
    update,
    destroy,
    show,
  };
});
