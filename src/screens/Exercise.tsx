import { useNavigation, useRoute } from "@react-navigation/native";
import { ScrollView, TouchableOpacity } from "react-native";

import { AppNavigationRoutesProps } from "@routes/app.routes";

import { Box } from "@components/ui/box";
import { Heading } from "@components/ui/heading";
import { HStack } from "@components/ui/hstack";
import { Icon } from "@components/ui/icon";
import { Image } from "@components/ui/image";
import { Text } from "@components/ui/text";
import { VStack } from "@components/ui/vstack";

import { ArrowLeft } from "lucide-react-native";

import BodySvg from "@assets/body.svg";
import RepetitionsSvg from "@assets/repetitions.svg";
import SeriesSvg from "@assets/series.svg";

import { Button } from "@components/Button";
import { Loading } from "@components/Loading";
import { useAppContext } from "@contexts/AppContext";
import { ExerciseDTO } from "@dtos/ExercisesDTO";
import { useToastMessage } from "@hooks/useToastMessage";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { useEffect, useState } from "react";

type RouteParams = {
  id: number;
};

export function Exercise() {
  const [sendingRegister, setSendingRegister] = useState(false);
  const navigation = useNavigation<AppNavigationRoutesProps>();

  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);
  const { getExerciseById, patchExerciseAsFinished, isLoading, setIsLoading } =
    useAppContext();
  const { handleAlert } = useToastMessage();

  const route = useRoute();
  const { id } = route.params as RouteParams;

  const goBack = () => {
    navigation.goBack();
  };

  const handleGetExerciseById = async () => {
    try {
      setIsLoading(true);
      const exercise = await getExerciseById(id);
      setExercise(exercise);
    } catch (errors) {
      const error = errors as AppError;
      handleAlert(
        {
          id: "get-exercise-by-id-error",
          title: "Erro",
          description: error.message,
          action: "error",
        },
        "top",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterExerciseFinished = async () => {
    try {
      setSendingRegister(true);
      await patchExerciseAsFinished(id);
      handleAlert(
        {
          id: "exercise-registered-success",
          title: "Parabéns",
          description: "Exercício registrado como realizado com sucesso!",
          action: "success",
        },
        "top",
      );
      navigation.navigate("tabs", { screen: "history" });
    } catch (errors) {
      const error = errors as AppError;
      handleAlert(
        {
          id: "get-exercise-by-id-error",
          title: "Erro",
          description: error.message,
          action: "error",
        },
        "top",
      );
    } finally {
      setSendingRegister(false);
    }
  };

  useEffect(() => {
    handleGetExerciseById();
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack className="flex-1">
      <VStack className="px-8 bg-gray-600 pt-12">
        <TouchableOpacity onPress={goBack} className="mt-5">
          <Icon as={ArrowLeft} size="xl" className="text-green-500" />
        </TouchableOpacity>

        <HStack className="mt-4 pb-8 justify-between items-center">
          <Heading className="text-gray-100 text-lg font-heading shrink-1">
            {exercise.name}
          </Heading>
          <HStack className="items-center">
            <BodySvg width={16} height={16} />
            <Text className="text-gray-200 ml-1 capitalize">
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <VStack className="p-8 flex-1">
          <Box className="mb-3 rounded-lg overflow-hidden">
            <Image
              source={{
                uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`,
              }}
              alt="Gym image"
              className="w-full h-96 bg-gray-600"
              size="lg"
              resizeMode="cover"
            />
          </Box>

          <Box className="bg-gray-600 rounded-md pb-4 px-4">
            <HStack className="justify-around items-center mt-5 mb-6">
              <HStack>
                <SeriesSvg />
                <Text className="text-gray-200 ml-2">
                  {exercise.series} séries
                </Text>
              </HStack>

              <HStack className="items-center">
                <RepetitionsSvg />
                <Text className="text-gray-200 ml-2">
                  {exercise.repetitions} repetições
                </Text>
              </HStack>
            </HStack>

            <Button
              title="Marcar como realizado"
              isLoading={sendingRegister}
              onPress={handleRegisterExerciseFinished}
            />
          </Box>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
