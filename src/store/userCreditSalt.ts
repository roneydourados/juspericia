import { defineStore } from "pinia";

export const useUserCreditSaltStore = defineStore("userCreditSalt", () => {
  const { api } = useAxios();

  const userCreditSalts = ref<UserCreditSalt[]>([]);
  const userCreditSalt = ref<UserCreditSalt>();

  const $all = computed(() => userCreditSalts.value);
  const $single = computed(() => userCreditSalt.value);

  const index = async (input: { isExpired?: boolean; status?: string }) => {
    const { isExpired, status } = input;
    const config = {
      params: {
        isExpired,
        status,
      },
    };
    const { data } = await api.get<UserCreditSalt[]>(
      "/user-credit-salt",
      config
    );

    userCreditSalts.value = data;
  };

  const create = async (payload: UserCreditSalt) => {
    const { data } = await api.post<UserCreditSalt>(
      "/user-credit-salt",
      payload
    );

    userCreditSalt.value = data;
  };

  const cancel = async (id: string) => {
    await api.put(`/user-credit-salt/cancel/${id}`);
  };

  const show = async (id: string) => {
    const { data } = await api.get<UserCreditSalt>(`/user-credit-salt/${id}`);

    userCreditSalt.value = data;
  };

  return {
    index,
    create,
    cancel,
    show,
    $all,
    $single,
  };
});
