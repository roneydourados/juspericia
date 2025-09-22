import { defineStore } from "pinia";
import { uuidv7 } from "uuidv7";

export const useFileStore = defineStore("file", () => {
  const { api } = useAxios();
  const files = ref<FileProps[]>([]);

  const $files = computed(() => files.value);

  const index = async (input: { ownerId: number; fileCategory: string }) => {
    const { ownerId, fileCategory } = input;
    const config = {
      params: {
        ownerId,
        fileCategory,
      },
    };

    const { data } = await api.get<FileProps[]>("/files", config);

    files.value = data;
  };

  const uploadAws = async (payload: FileProps) => {
    const formData = new FormData();
    formData.append("file", payload.fileData!);
    formData.append("fileCategory", payload.fileCategory!);
    formData.append("fileName", payload.fileName!);
    formData.append("ownerId", payload.ownerId!.toString());

    await api.post("files/aws", formData);
  };

  const uploadManyAws = async (payload: FileProps[]) => {
    const formData = new FormData();

    payload.map((file) => {
      formData.append("file", file.fileData!);
      formData.append("fileCategory", file.fileCategory!);
      formData.append("fileName", file.fileName!);
      formData.append("ownerId", String(file.ownerId));
    });

    await api.post("files/aws/upload-many", formData);
  };

  const removeManyAws = async (ownerId: number, fileCategory: string) => {
    const config = {
      params: {
        ownerId,
        fileCategory,
      },
    };

    await api.delete("files/aws/remove-many", config);
  };

  const removeAws = async (publicId: string) => {
    await api.delete(`/files/aws/${publicId}`);
  };

  const downloadMergedFiles = async (input: {
    fileCategory: string;
    ownerId: number;
  }) => {
    const { fileCategory, ownerId } = input;
    const config = {
      params: {
        fileCategory,
        ownerId,
      },
    };

    const resp = await api.get<ArrayBuffer>("/files/download-merged", {
      ...config,
      responseType: "arraybuffer",
    });

    const contentDisposition = resp.headers["content-disposition"];

    let fileName = `${uuidv7()}.pdf`;
    let fileType = "application/octet-stream"; // Tipo padrão

    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/);
      if (match && match[1]) {
        fileName = match[1];

        const fileExtension = fileName.split(".").pop()?.toLowerCase();

        // Mapeamento de tipos MIME
        const mimeTypes: { [key: string]: string } = {
          pdf: "application/pdf",
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

  const downloadAws = async (publicId: string) => {
    const resp = await api.get(`/files/aws/${publicId}`, {
      responseType: "arraybuffer",
    });

    const contentDisposition = resp.headers["content-disposition"];

    let fileName = "";
    let fileType = "application/octet-stream"; // Tipo padrão

    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/);
      if (match && match[1]) {
        fileName = match[1];
        const fileExtension = fileName.split(".").pop()?.toLowerCase();

        // Mapeamento de tipos MIME
        const mimeTypes: { [key: string]: string } = {
          pdf: "application/pdf",
          jpg: "image/jpeg",
          jpeg: "image/jpeg",
          png: "image/png",
          gif: "image/gif",
          txt: "text/plain",
          html: "text/html",
          doc: "application/msword",
          docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          xls: "application/vnd.ms-excel",
          xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          ppt: "application/vnd.ms-powerpoint",
          pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          csv: "text/csv",
          json: "application/json",
          xml: "application/xml",
          zip: "application/zip",
          rar: "application/x-rar-compressed",
          tar: "application/x-tar",
          gz: "application/gzip",
          mp3: "audio/mpeg",
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

  const remove = async (publicId: string) => {
    await api.delete(`/files/${publicId}`);
  };

  const download = async (publicId: string) => {
    const resp = await api.get(`/files/${publicId}`, {
      responseType: "arraybuffer",
    });

    const contentDisposition = resp.headers["content-disposition"];

    let fileName = "";
    let fileType = "application/octet-stream"; // Tipo padrão

    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/);
      if (match && match[1]) {
        fileName = match[1];
        const fileExtension = fileName.split(".").pop()?.toLowerCase();

        // Mapeamento de tipos MIME
        const mimeTypes: { [key: string]: string } = {
          pdf: "application/pdf",
          jpg: "image/jpeg",
          jpeg: "image/jpeg",
          png: "image/png",
          gif: "image/gif",
          txt: "text/plain",
          html: "text/html",
          doc: "application/msword",
          docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          xls: "application/vnd.ms-excel",
          xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          ppt: "application/vnd.ms-powerpoint",
          pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          csv: "text/csv",
          json: "application/json",
          xml: "application/xml",
          zip: "application/zip",
          rar: "application/x-rar-compressed",
          tar: "application/x-tar",
          gz: "application/gzip",
          mp3: "audio/mpeg",
          mp4: "video/mp4",
        };

        fileType = mimeTypes[fileExtension!] || fileType; // Use o tipo MIME correspondente à extensão do arquivo
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

  const upload = async (payload: FileProps) => {
    const formData = new FormData();
    formData.append("file", payload.fileData!);
    formData.append("fileCategory", payload.fileCategory!);
    formData.append("fileName", payload.fileName!);
    formData.append("ownerId", payload.ownerId!.toString());

    await api.post("files", formData);
  };

  const uploadMany = async (payload: FileProps[]) => {
    const formData = new FormData();

    payload.map((file) => {
      formData.append("file", file.fileData!);
      formData.append("fileCategory", file.fileCategory!);
      formData.append("fileName", file.fileName!);
      formData.append("ownerId", String(file.ownerId));
    });

    await api.post("files/upload-many", formData);
  };

  return {
    $files,
    index,
    remove,
    download,
    upload,
    uploadMany,
    removeAws,
    uploadAws,
    uploadManyAws,
    downloadAws,
    removeManyAws,
    downloadMergedFiles,
  };
});
