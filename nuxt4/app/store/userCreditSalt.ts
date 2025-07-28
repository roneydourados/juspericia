import { defineStore } from "pinia";

export const useUserCreditSaltStore = defineStore("userCreditSalt", () => {
  const { api } = useAxios();

  const userCreditSalts = ref<UserCreditSaltResponseProps>();
  const userCreditLog = ref<UserCreditLog[]>([]);

  const $credits = computed(() => userCreditSalts.value);
  const $userCreditLog = computed(() => userCreditLog.value);

  const index = async (input: {
    status?: string;
    userId?: number;
    initialDate?: string;
    finalDate?: string;
    isSalt?: boolean;
  }) => {
    const { status, initialDate, finalDate, isSalt, userId } = input;
    const config = {
      params: {
        userId,
        status,
        initialDate,
        finalDate,
        isSalt,
      },
    };
    const { data } = await api.get<UserCreditSaltResponseProps>(
      "/user-credit-salt",
      config
    );

    userCreditSalts.value = data;
  };

  const indexAdmin = async (input: {
    status?: string;
    userId?: number;
    initialDate?: string;
    finalDate?: string;
    isSalt?: boolean;
    publicIdExclude?: string;
  }) => {
    const { status, initialDate, finalDate, isSalt, userId, publicIdExclude } =
      input;
    const config = {
      params: {
        userId,
        status,
        initialDate,
        finalDate,
        isSalt,
        publicIdExclude,
      },
    };
    const { data } = await api.get<UserCreditSaltResponseProps>(
      "/user-credit-salt/admin",
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

  const transferSalt = async (input: {
    publicIdOrigin: string;
    publicIdDestination: string;
  }) => {
    const { publicIdOrigin, publicIdDestination } = input;

    const payload = {
      publicIdOrigin,
      publicIdDestination,
    };

    await api.put("/user-credit-salt/transfer-salt", payload);
  };

  return {
    indexAdmin,
    index,
    getUserCreditLog,
    transferSalt,
    $credits,
    $userCreditLog,
  };
});
