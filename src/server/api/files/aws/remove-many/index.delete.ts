import { removeManyAwsS3 } from "@/server/repositories/fileRepository";

export default defineEventHandler(async (event) => {
  const { ownerId, fileCategory } = getQuery(event);

  setResponseStatus(event, 200);

  return removeManyAwsS3(Number(ownerId), String(fileCategory));
});
