import { HistoryCard } from "@components/HistoryCard";
import { Loading } from "@components/Loading";
import { ScreenHeader } from "@components/ScreenHeader";
import { Heading } from "@components/ui/heading";
import { Text } from "@components/ui/text";
import { VStack } from "@components/ui/vstack";
import { useAppContext } from "@contexts/AppContext";
import { useToastMessage } from "@hooks/useToastMessage";
import { useFocusEffect } from "@react-navigation/native";
import { AppError } from "@utils/AppError";
import { useCallback } from "react";
import { SectionList } from "react-native";

export function History() {
  const { historyByDay: exercises, getHistoryByDay } = useAppContext();

  const { isLoading, setIsLoading } = useAppContext();
  const { handleAlert } = useToastMessage();

  const handleGetHistory = async () => {
    try {
      await getHistoryByDay();
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

  // Quando a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      handleGetHistory();
    }, []),
  );

  return (
    <VStack className="flex-1">
      <ScreenHeader title="Histórico" />
      {isLoading ? (
        <Loading />
      ) : (
        <SectionList
          sections={exercises ?? []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <HistoryCard data={item} />}
          renderSectionHeader={({ section }) => (
            <Heading className="text-gray-200 text-md mt-10 mb-3 font-heading">
              {section.title}
            </Heading>
          )}
          contentContainerStyle={
            exercises.length === 0 && { flex: 1, justifyContent: "center" }
          }
          ListEmptyComponent={() => (
            <Text className="text-gray-100 text-center">
              Não há exercícios registrados ainda. {"\n"}
              Vamos fazer exercícios hoje?
            </Text>
          )}
          showsVerticalScrollIndicator={false}
          style={{ paddingHorizontal: 32 }}
        />
      )}
    </VStack>
  );
}
