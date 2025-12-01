import { ExerciseDTO } from "@dtos/ExercisesDTO";
import { HistoryByDayDTO } from "@dtos/HistoryByDayDTO";
import { getExerciseByGroupApi, getExerciseByIdApi } from "@services/exercises";
import { getGroupsApi } from "@services/groups";
import {
  getHistoryByDayApi,
  registerExerciseInHistoryApi,
} from "@services/history";
import { createContext, useContext, useState } from "react";

export interface AppContextData {
  isLoading: boolean;
  groups: string[];
  exercises: ExerciseDTO[];
  historyByDay: HistoryByDayDTO[];
  setIsLoading: (value: boolean) => void;
  getGroups: () => Promise<void>;
  getExercisesByGroup: (group: string) => Promise<void>;
  getExerciseById: (id: number) => Promise<ExerciseDTO>;
  patchExerciseAsFinished: (id: number) => Promise<void>;
  getHistoryByDay: () => Promise<void>;
}

export const AppContext = createContext({} as AppContextData);

type AppContextProviderProps = {
  children: React.ReactNode;
};

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<string[]>([]);
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
  const [historyByDay, setHistoryByDay] = useState<HistoryByDayDTO[]>([]);

  const getGroups = async () => {
    const groupsData = await getGroupsApi();
    setGroups(groupsData);
  };

  const getExercisesByGroup = async (group: string) => {
    const exercisesData = await getExerciseByGroupApi(group);
    setExercises(exercisesData);
  };

  const getExerciseById = async (id: number) => {
    const exercise = await getExerciseByIdApi(id);
    return exercise;
  };

  const patchExerciseAsFinished = async (id: number) => {
    await registerExerciseInHistoryApi(id);
  };

  const getHistoryByDay = async () => {
    const history = await getHistoryByDayApi();
    setHistoryByDay(history);
  };

  return (
    <AppContext.Provider
      value={{
        groups,
        exercises,
        historyByDay,
        isLoading,
        setIsLoading,
        getGroups,
        getExercisesByGroup,
        getExerciseById,
        patchExerciseAsFinished,
        getHistoryByDay,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
