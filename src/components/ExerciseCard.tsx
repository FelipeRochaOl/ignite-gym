import { ChevronRight } from "lucide-react-native";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

import { ExerciseDTO } from "@dtos/ExercisesDTO";
import { api } from "@services/api";
import { Heading } from "./ui/heading";
import { HStack } from "./ui/hstack";
import { Icon } from "./ui/icon";
import { Image } from "./ui/image";
import { Text } from "./ui/text";
import { VStack } from "./ui/vstack";

type ExerciseCardProps = TouchableOpacityProps & {
  data: ExerciseDTO;
};

export function ExerciseCard({ data, ...props }: ExerciseCardProps) {
  return (
    <TouchableOpacity {...props}>
      <HStack className="bg-gray-500 items-center p-2 pr-4 roudned-md mb-3">
        <Image
          source={{
            uri: `${api.defaults.baseURL}/exercise/thumb/${data.thumb}`,
          }}
          alt="Gym image"
          className="w-16 h-16 rounded-md mr-4 bg-gray-600"
          resizeMode="cover"
        />
        <VStack className="flex-1">
          <Heading className="text-lg text-white font-heading">
            {data.name}
          </Heading>
          <Text className="text-sm text-gray-200 mt-1" numberOfLines={2}>
            {data.series} séries x {data.repetitions} repetições
          </Text>
        </VStack>
        <Icon as={ChevronRight} className="text-gray-300" />
      </HStack>
    </TouchableOpacity>
  );
}
