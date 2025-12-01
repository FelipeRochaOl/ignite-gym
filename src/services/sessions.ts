import { SignInDTO } from "@dtos/SignInDTO";
import { UserDTO } from "@dtos/UserDTO";
import { AxiosResponse } from "axios";
import { api } from "./api";

export const login = async ({ email, password }: SignInDTO) => {
  const response = await api.post<
    SignInDTO,
    AxiosResponse<{ user: UserDTO; token: string; refresh_token: string }>
  >("/sessions", { email, password });
  return response.data;
};
