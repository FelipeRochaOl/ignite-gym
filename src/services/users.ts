import { ProfileDTO } from "@dtos/ProfileDTO";
import { SignUpDTO } from "@dtos/SignUpDTO";
import { UserDTO } from "@dtos/UserDTO";
import { AxiosResponse } from "axios";
import { api } from "./api";

export const register = async ({ name, email, password }: SignUpDTO) => {
  const response = await api.post("/users", {
    name,
    email,
    password,
  });
  return response.data;
};

export const updateUserProfile = async ({
  name,
  password,
  oldPassword,
}: ProfileDTO) => {
  const response = await api.put("/users", {
    name,
    password,
    old_password: oldPassword,
  });
  return response.data;
};

export const updateAvatar = async (avatarFile: FormData) => {
  const response = await api.patch<FormData, AxiosResponse<UserDTO>>(
    "/users/avatar",
    avatarFile,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};
