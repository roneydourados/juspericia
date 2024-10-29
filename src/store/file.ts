import { defineStore } from "pinia";
import fs from "fs";

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

  const remove = async (publicId: string) => {
    await api.delete(`/files/${publicId}`);
  };

  const download = async (publicId: string) => {
    const resp = await api.get(`/files/${publicId}`, {
      responseType: "stream",
    });

    const contentDisposition = resp.headers["content-disposition"];

    let fileName = "downloaded-file.txt";

    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/);
      if (match && match[1]) {
        fileName = match[1];
      }
    }

    const file = new Blob([resp.data], {
      type: "application/octet-stream",
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

  return { $files, index, remove, download, upload, uploadMany };
});
