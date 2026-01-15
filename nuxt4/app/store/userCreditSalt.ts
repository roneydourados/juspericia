import { defineStore } from "pinia";

export const useUserCreditSaltStore = defineStore("userCreditSalt", () => {
  const { api } = useAxios();

  const userCreditSalts = ref<UserCreditSaltResponseProps>();
  const userCreditLog = ref<any[]>([]);
  const userCreditTotalSalt = ref<UserCreditTotalSaltProps>();
  const lawyers = ref<laywersUserCreditProps>();
  const $credits = computed(() => userCreditSalts.value);
  const $userCreditLog = computed(() => userCreditLog.value);
  const $userCreditTotalSalt = computed(() => userCreditTotalSalt.value);
  const $lawyers = computed(() => lawyers.value);

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
    const { data } = await api.get<any[]>(`/user-credit-salt/${publicId}`);

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

  const updateExpireAt = async (input: {
    publicId: string;
    newExpireAt: string;
  }) => {
    await api.put("/user-credit-salt/update-expireat", input);
  };

  const getTotalSalt = async (publicId: string) => {
    const { data } = await api.get<UserCreditTotalSaltProps>(
      `/user-credit-salt/total/${publicId}`
    );

    userCreditTotalSalt.value = data;
  };

  const getLawyers = async (userId?: number) => {
    const config = {
      params: {
        userId,
      },
    };
    const { data } = await api.get<laywersUserCreditProps>(
      "/user-credit-salt-lawyers",
      config
    );

    lawyers.value = data;
  };

  const storeManualCredit = async (input: {
    userId: number;
    value: number;
    solicitationConsultationValue: number;
  }) => {
    const { userId, value, solicitationConsultationValue } = input;
    const payload = {
      userId,
      value,
      type: "C",
      solicitationConsultationValue,
    };

    await api.post("/user-credit-salt", payload);
  };

  const destroyManualCredit = async (publicId: string) => {
    await api.delete(`/user-credit-salt/${publicId}`);
  };

  return {
    indexAdmin,
    index,
    getUserCreditLog,
    transferSalt,
    $credits,
    $userCreditLog,
    $userCreditTotalSalt,
    $lawyers,
    updateExpireAt,
    getTotalSalt,
    getLawyers,
    storeManualCredit,
    destroyManualCredit,
  };
});
