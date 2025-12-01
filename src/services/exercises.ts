import { ExerciseDTO } from "@dtos/ExercisesDTO";
import { api } from "./api";

export const getExerciseByGroupApi = async (
  group: string,
): Promise<ExerciseDTO[]> => {
  const response = await api.get(`/exercises/bygroup/${group}`);
  return response.data;
};

export const getExerciseByIdApi = async (id: number): Promise<ExerciseDTO> => {
  const response = await api.get(`/exercises/${id}`);
  return response.data;
};
