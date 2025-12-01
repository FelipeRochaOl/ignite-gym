import { api } from "./api";

export const getGroupsApi = async (): Promise<string[]> => {
  const response = await api.get("/groups");
  return response.data;
};
