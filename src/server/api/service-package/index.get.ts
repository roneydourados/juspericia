import { getServicePackages } from "~/server/repositories/servicePackageRepository";

export default defineEventHandler(async (event) => {
  const { status } = getQuery(event);

  setResponseStatus(event, 200);

  return getServicePackages(String(status));
});
