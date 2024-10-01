import { index } from "@/server/repositories/fileRepository";

export default defineEventHandler(async (event) => {
  const { ownerId, fileCategory } = getQuery(event);

  // const { userLogged } = useAuthUser();
  // const user = userLogged(event);

  setResponseStatus(event, 200);

  return index({
    ownerId: Number(ownerId),
    fileCategory: String(fileCategory),
  });
});
