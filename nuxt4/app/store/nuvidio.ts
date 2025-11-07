import { defineStore } from "pinia";
import { uuidv7 } from "uuidv7";

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

  const createInviteTeleConferenceLoose = async (input: {
    publicId: string;
    intrevalMinutes: number;
  }) => {
    const { publicId, intrevalMinutes } = input;
    const { data } = await api.post<NuvidioInviteLinkResponse>(
      "/nuvidio/invite-link/loose",
      {
        publicId,
        intrevalMinutes,
      }
    );

    nuvidioLinkInvite.value = data;
  };

  const getRecordCall = async (inviteId: string) => {
    const config = {
      params: {
        inviteId,
      },
    };

    const resp = await api.get<ArrayBuffer>("/nuvidio/record-call", {
      ...config,
      responseType: "arraybuffer",
    });

    const contentDisposition = resp.headers["content-disposition"];

    let fileName = `${uuidv7()}.mp4`;
    let fileType = "video/mp4"; // Tipo padrão

    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/);
      if (match && match[1]) {
        fileName = match[1];

        const fileExtension = fileName.split(".").pop()?.toLowerCase();

        // Mapeamento de tipos MIME
        const mimeTypes: { [key: string]: string } = {
          mp4: "video/mp4",
        };

        fileType = mimeTypes[fileExtension!] || fileType;
      }
    }

    const file = new Blob([resp.data], {
      type: fileType,
    });

    return {
      file,
      fileName,
    };
  };

  const deleteInviteLink = async (nuvidioId: string) => {
    await api.delete(`/nuvidio/invite-link/${nuvidioId}`);
  };

  return {
    $nuvidioLinkInvite,
    createAttendantDepartment,
    createInviteTeleConference,
    //getInviteLink,
    getRecordCall,
    deleteInviteLink,
    createInviteTeleConferenceLoose,
  };
});
