import { defineStore } from "pinia";

export const useZapsignStore = defineStore("zapsign", () => {
  const { api } = useAxios();

  const document = ref<DocumentResponseProps>();
  const $document = computed(() => document.value);

  const sendDocument = async (payload: SendDocumentProps) => {
    const { data } = await api.post<DocumentResponseProps>(
      "/zapsign/documents",
      payload
    );

    document.value = data;
  };

  const getDocument = async (token: string) => {
    const { data } = await api.get<DocumentResponseProps>(
      `/zapsign/documents/${token}`
    );

    document.value = data;
  };

  return {
    $document,
    sendDocument,
    getDocument,
  };
});
