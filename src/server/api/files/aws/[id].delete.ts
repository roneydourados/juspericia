import { removeAwsS3 } from "@/server/repositories/fileRepository";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;

  setResponseStatus(event, 204);

  return removeAwsS3(id);
});
