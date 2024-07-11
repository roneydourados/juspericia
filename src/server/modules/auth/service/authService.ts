import { H3Event } from "h3";
import * as repository from "../repository/authRepository";
import { UserProps } from "@/types/User";

export const login = async (event: H3Event) => {
  const body = await readBody<UserProps>(event);

  setResponseStatus(event, 200);

  return repository.login(body);
};

export const register = async (event: H3Event) => {
  const body = await readBody<UserProps>(event);

  setResponseStatus(event, 201);

  return repository.register(body);
};

export const verifyUser = async (event: H3Event) => {
  const id = parseInt(event.context.params!.id) as number;

  setResponseStatus(event, 200);

  return repository.verifyUser(id);
};
