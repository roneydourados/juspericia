import { defineStore } from "pinia";

export const useSellerStore = defineStore("seller", () => {
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

    const { data } = await api.get<UserProps[]>("/user-seller", config);

    users.value = data;
  };

  const show = async (id: string) => {
    const { data } = await api.get<UserProps>(`/user-seller/${id}`);

    user.value = data;
  };

  const create = async (input: UserProps) => {
    const { data } = await api.post<UserProps>("/user-seller", input);

    user.value = data;
  };

  const update = async (input: UserProps) => {
    const { data } = await api.put<UserProps>("/user-seller", input);

    user.value = data;
  };

  const destroy = async (id: string) => {
    await api.delete(`/user-seller/${id}`);
  };

  return { $single, $all, index, create, update, destroy, show };
});
