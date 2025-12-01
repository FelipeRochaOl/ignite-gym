import { HistoryDTO } from "@dtos/HistoryDTO";
import { Heading } from "./ui/heading";
import { HStack } from "./ui/hstack";
import { Text } from "./ui/text";
import { VStack } from "./ui/vstack";

export type HistoryCardProps = {
  data: HistoryDTO;
};

export function HistoryCard({ data }: HistoryCardProps) {
  return (
    <HStack className="w-full px-5 py-4 mb-3 bg-gray-600 rounded-md justify-between items-center">
      <VStack className="flex-1 mr-5 gap-3">
        <Heading
          className="text-white text-md capitalize font-heading"
          numberOfLines={1}
        >
          {data.group}
        </Heading>
        <Text className="text-gray-100 text-lg" numberOfLines={1}>
          {data.name}
        </Text>
      </VStack>
      <Text className="text-gray-300 text-md">{data.hour}</Text>
    </HStack>
  );
}
