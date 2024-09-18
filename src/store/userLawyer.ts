import { defineStore } from "pinia";

export const useUserLawyerStore = defineStore("userLawyer", () => {
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

  return { $single, $all, index, create, update, destroy, show };
});
