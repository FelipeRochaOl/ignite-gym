import { HistoryByDayDTO } from "@dtos/HistoryByDayDTO";
import { api } from "./api";

export const registerExerciseInHistoryApi = async (
  id: number,
): Promise<void> => {
  await api.post("/history", { exercise_id: id });
};

export const getHistoryByDayApi = async (): Promise<HistoryByDayDTO[]> => {
  const response = await api.get("/history");
  return response.data;
};
