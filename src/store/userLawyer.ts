import { defineStore } from "pinia";

export const useUserLawyerStore = defineStore("userLawyer", () => {
  const { api } = useAxios();

  const user = ref<UserProps>();
  const users = ref<UserProps[]>([]);
  const estatistics = ref<UserLawyerEstatisticsProps>();
  const $single = computed(() => user.value);
  const $all = computed(() => users.value);
  const $estatistics = computed(() => estatistics.value);

  const index = async (inputQuery: string) => {
    const config = {
      params: {
        inputQuery,
      },
    };

    const { data } = await api.get<UserProps[]>("/user-lawyer", config);

    users.value = data;
  };

  const show = async (id: string) => {
    const { data } = await api.get<UserProps>(`/user-lawyer/${id}`);

    user.value = data;
  };

  const create = async (input: UserProps) => {
    const { data } = await api.post<UserProps>("/user-lawyer", input);

    user.value = data;
  };

  const update = async (input: UserProps) => {
    const { data } = await api.put<UserProps>("/user-lawyer", input);

    user.value = data;
  };

  const destroy = async (id: string) => {
    await api.delete(`/user-lawyer/${id}`);
  };

  const getEstatistics = async ({
    initialDate,
    finalDate,
  }: UserLawyerEstatisticsFilterProps) => {
    const config = {
      params: {
        initialDate,
        finalDate,
      },
    };

    const { data } = await api.get<UserLawyerEstatisticsProps>(
      `/user-lawyer/estatistics`,
      config
    );

    estatistics.value = data;
  };

  const register = async (payload: UserProps) => {
    const { data } = await api.post<UserProps>(
      "/user-lawyer/register",
      payload
    );

    user.value = data;
  };

  const activeAccount = async (token: string) => {
    await api.put(`/user-lawyer/register/${token}`);
  };

  const forgotActiveLink = async (token: string) => {
    await api.post(`/user-lawyer/register/forgot-activate-link/${token}`);
  };

  return {
    $single,
    $all,
    $estatistics,
    index,
    create,
    update,
    destroy,
    show,
    getEstatistics,
    register,
    activeAccount,
    forgotActiveLink,
  };
});
