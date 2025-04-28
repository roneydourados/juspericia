import { uploadAwsS3 } from "@/server/repositories/fileRepository";

export default defineEventHandler(async (event) => {
  const body = await readFormData(event);
  const file = body.get("file") as File;

  // const { userLogged } = useAuthUser();
  // const user = userLogged(event);

  const payload = {
    fileData: file,
    fileCategory: body.get("fileCategory") as string,
    fileName: body.get("fileName") as string,
    ownerId: parseInt(body.get("ownerId") as string),
  };

  setResponseStatus(event, 200);

  return uploadAwsS3(payload);
});
