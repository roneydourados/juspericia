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

  const getSignedFile = async (publicId: string) => {
    const resp = await api.get(
      `/zapsign/documents/document-singed/${publicId}`
    );

    let fileType = "application/octet-stream";

    const { base64, fileName } = resp.data;

    // Decodifica base64 → Uint8Array
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    // Cria o Blob e também o ArrayBuffer
    const fileBlob = new Blob([byteArray], { type: fileType });

    return {
      fileName,
      fileBlob,
    };
  };

  //atualizar o laudo para assinado, apenas para evitar erros de ficar clicando no mesmo laudo para assinar várias vezes
  const updateReportToSigned = async (input: {
    publicId: string;
    signStatus: string;
  }) => {
    const { publicId, signStatus } = input;

    const payload = {
      signStatus,
    };

    await api.put(`/zapsign/report-signed/${publicId}`, payload);
  };

  return {
    $document,
    sendDocument,
    getDocument,
    getSignedFile,
    updateReportToSigned,
  };
});
