import { defineStore } from "pinia";

export const useUserAdminStore = defineStore("userAdmin", () => {
  const { api } = useAxios();

  const user = ref<UserProps>();
  const users = ref<UserProps[]>([]);
  const $single = computed(() => user.value);
  const $all = computed(() => users.value);

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

  return { $single, $all, index, create, update, destroy, show };
});
