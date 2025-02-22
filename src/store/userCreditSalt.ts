import { SaleFilterProps } from "@/types/Sale";
import { defineStore } from "pinia";

export const useUserCreditSaltStore = defineStore("userCreditSalt", () => {
  const { api } = useAxios();

  const userCreditSalts = ref<UserCreditSaltResponseProps>();
  const userCreditLog = ref<UserCreditLog[]>([]);

  const $credits = computed(() => userCreditSalts.value);
  const $userCreditLog = computed(() => userCreditLog.value);

  const index = async (input: SaleFilterProps) => {
    const { status, initialDate, finalDate } = input;
    const config = {
      params: {
        status,
        initialDate,
        finalDate,
      },
    };
    const { data } = await api.get<UserCreditSaltResponseProps>(
      "/user-credit-salt",
      config
    );

    userCreditSalts.value = data;
  };

  const getUserCreditLog = async (publicId: string) => {
    const { data } = await api.get<UserCreditLog[]>(
      `/user-credit-salt/${publicId}`
    );

    userCreditLog.value = data;
  };

  // const create = async (payload: UserCreditSalt) => {
  //   const { data } = await api.post<UserCreditSalt>(
  //     "/user-credit-salt",
  //     payload
  //   );

  //   userCreditSalt.value = data;
  // };

  // const cancel = async (id: string) => {
  //   await api.put(`/user-credit-salt/cancel/${id}`);
  // };

  // const show = async (id: string) => {
  //   const { data } = await api.get<UserCreditSalt>(`/user-credit-salt/${id}`);

  //   userCreditSalt.value = data;
  // };

  return {
    index,
    // create,
    // cancel,
    // show,
    getUserCreditLog,
    $credits,
    $userCreditLog,
  };
});
