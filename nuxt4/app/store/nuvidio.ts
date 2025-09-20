import { defineStore } from "pinia";

export const useNuvidioStore = defineStore("nuvidio", () => {
  const { api } = useAxios();

  const nuvidioLinkInvite = ref<NuvidioInviteLinkResponse>();

  const $nuvidioLinkInvite = computed(() => nuvidioLinkInvite.value);

  const createAttendantDepartment = async (publicId: string) => {
    await api.post("/nuvidio/department", {
      publicId,
    });
  };

  const createInviteTeleConference = async (input: {
    publicId: string;
    intrevalMinutes: number;
  }) => {
    const { publicId, intrevalMinutes } = input;
    const { data } = await api.post<NuvidioInviteLinkResponse>(
      "/nuvidio/invite-link",
      {
        publicId,
        intrevalMinutes,
      }
    );

    nuvidioLinkInvite.value = data;
  };

  const getInviteLink = async (publicId: string) => {
    const config = {
      params: {
        publicId,
      },
    };

    const { data } = await api.get<NuvidioInviteLinkResponse>(
      "/nuvidio/invite-link",
      config
    );

    nuvidioLinkInvite.value = data;
  };

  return {
    $nuvidioLinkInvite,
    createAttendantDepartment,
    createInviteTeleConference,
    getInviteLink,
  };
});
