import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
  const { api } = useAxios();

  const user = ref<UserProps>();
  const users = ref<UserProps[]>([]);
  const $single = computed(() => user.value);
  const $all = computed(() => users.value);

  const index = async (inputQuery: string, profileType?: ProfileType) => {
    const config = {
      params: {
        inputQuery,
        profileType,
      },
    };

    const { data } = await api.get<UserProps[]>("/user", config);

    users.value = data;
  };

  const show = async (id: number) => {
    const { data } = await api.get<UserProps>(`/user/${id}`);

    user.value = data;
  };

  const create = async (input: UserProps) => {
    const { data } = await api.post<UserProps>("/user", input);

    user.value = data;
  };

  const update = async (input: UserProps) => {
    const { data } = await api.put<UserProps>("/user", input);

    user.value = data;
  };

  const destroy = async (id: number) => {
    await api.delete(`/user/${id}`);
  };

  return { $single, $all, index, create, update, destroy, show };
});
