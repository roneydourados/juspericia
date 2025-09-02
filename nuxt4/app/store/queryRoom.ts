import { defineStore } from "pinia";
/**Store para ligar com o back-end referente as salas de conversação */
export const useQueryRoomStore = defineStore("queryRoom", () => {
  const { api } = useAxios();
  const createRoomLinkResponse = ref<QueryRoomLinkCreateResponse>();
  const validadeRoomLinkResponse = ref<QueryRoomLinkValidateResponse>();

  const $createdRoomLink = computed(() => createRoomLinkResponse.value);
  const $validadeRoomLink = computed(() => validadeRoomLinkResponse.value);

  const createRoomLink = async (input: { solicitationId: number }) => {
    const payload = {
      solicitationId: input.solicitationId,
    };

    const { data } = await api.post<QueryRoomLinkCreateResponse>(
      "/query/room-links",
      payload
    );

    createRoomLinkResponse.value = data;
  };

  const validate = async (token: string) => {
    const payload = {
      token,
    };

    const { data } = await api.post<QueryRoomLinkValidateResponse>(
      "/query/room-links/validate",
      payload
    );

    validadeRoomLinkResponse.value = data;
  };

  const closeRoom = async (token: string) => {
    const payload = {
      token,
    };

    await api.post("/query/room-links/close", payload);
  };

  return {
    $createdRoomLink,
    $validadeRoomLink,
    createRoomLink,
    validate,
    closeRoom,
  };
});
