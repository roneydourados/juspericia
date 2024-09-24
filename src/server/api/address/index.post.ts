import { AddressProps } from "@/types/Address";
import { create } from "./repository/addressRepository";

export default defineEventHandler(async (event) => {
  const body = await readBody<AddressProps>(event);

  setResponseStatus(event, 200);

  return create(body);
});
