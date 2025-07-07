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

  // const getSignedFile = async (publicId: string) => {
  //   const resp = await api.get(
  //     `/zapsign/documents/document-singed/${publicId}`,
  //     {
  //       responseType: "arraybuffer",
  //     }
  //   );

  //   const contentDisposition = resp.headers["content-disposition"];

  //   console.log("🚀 ~ getSignedFile ~ match:", resp.data);

  //   let fileName = "";
  //   let fileType = "application/octet-stream"; // Tipo padrão

  //   if (contentDisposition) {
  //     const match = contentDisposition.match(/filename="(.+)"/);
  //     if (match && match[1]) {
  //       fileName = match[1];
  //       const fileExtension = fileName.split(".").pop()?.toLowerCase();

  //       // Mapeamento de tipos MIME
  //       const mimeTypes: { [key: string]: string } = {
  //         pdf: "application/pdf",
  //         jpg: "image/jpeg",
  //         jpeg: "image/jpeg",
  //         png: "image/png",
  //         gif: "image/gif",
  //         txt: "text/plain",
  //         html: "text/html",
  //         doc: "application/msword",
  //         docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  //         xls: "application/vnd.ms-excel",
  //         xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //         ppt: "application/vnd.ms-powerpoint",
  //         pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  //         csv: "text/csv",
  //         json: "application/json",
  //         xml: "application/xml",
  //         zip: "application/zip",
  //         rar: "application/x-rar-compressed",
  //         tar: "application/x-tar",
  //         gz: "application/gzip",
  //         mp3: "audio/mpeg",
  //         mp4: "video/mp4",
  //       };

  //       fileType = mimeTypes[fileExtension!] || fileType;
  //     }
  //   }

  //   const file = new Blob([resp.data], {
  //     type: fileType,
  //   });

  //   return {
  //     file,
  //     fileName: resp.data.fileName,
  //   };
  // };

  return {
    $document,
    sendDocument,
    getDocument,
    getSignedFile,
  };
});
