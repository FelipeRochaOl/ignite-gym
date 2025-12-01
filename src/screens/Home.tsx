import { ExerciseCard } from "@components/ExerciseCard";
import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { Loading } from "@components/Loading";
import { Heading } from "@components/ui/heading";
import { HStack } from "@components/ui/hstack";
import { Text } from "@components/ui/text";
import { VStack } from "@components/ui/vstack";
import { useAppContext } from "@contexts/AppContext";
import { useToastMessage } from "@hooks/useToastMessage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AppNavigationRoutesProps } from "@routes/app.routes";
import { AppError } from "@utils/AppError";
import { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native";

export function Home() {
  const { handleAlert } = useToastMessage();

  const {
    groups,
    exercises,
    isLoading,
    setIsLoading,
    getGroups,
    getExercisesByGroup,
  } = useAppContext();

  const [groupSelected, setGroupSelected] = useState("antebraço");

  const navigation = useNavigation<AppNavigationRoutesProps>();

  const handleOpenExerciseDetails = (id: number) => {
    navigation.navigate("exercise", { id });
  };

  const handleGetGroups = async () => {
    try {
      setIsLoading(true);
      await getGroups();
    } catch (errors) {
      const error = errors as AppError;
      handleAlert(
        {
          id: "1",
          title: "Nenhum grupo de exercícios encontrado",
          description: error.message,
          action: "info",
        },
        "top",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetExercisesByGroup = async (group: string) => {
    try {
      setIsLoading(true);
      await getExercisesByGroup(group);
    } catch (errors) {
      const error = errors as AppError;
      handleAlert(
        {
          id: "2",
          title: "Nenhum exercício encontrado",
          description: error.message,
          action: "info",
        },
        "top",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetGroups();
  }, []);

  useFocusEffect(
    useCallback(() => {
      handleGetExercisesByGroup(groupSelected);
    }, [groupSelected]),
  );

  return (
    <VStack className="flex-1">
      <HomeHeader />
      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            key={item}
            name={item}
            isActive={groupSelected.toLowerCase() === item.toLowerCase()}
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 32 }}
        style={{ marginVertical: 40, maxHeight: 44, minHeight: 44 }}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <VStack className="flex-1 px-8">
          <HStack className="justify-between mb-5 items-center">
            <Heading className="text-gray-200 text-md font-heading">
              Exercícios
            </Heading>
            <Text className="text-gray-200 text-sm font-body">
              {exercises.length}
            </Text>
          </HStack>

          <FlatList
            data={exercises}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <ExerciseCard
                data={item}
                onPress={() => handleOpenExerciseDetails(item.id)}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </VStack>
      )}
    </VStack>
  );
}
