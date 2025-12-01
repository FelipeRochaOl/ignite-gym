import { LogOut } from "lucide-react-native";

import { useAuth } from "@contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigationRoutesProps } from "@routes/auth.routes";
import { TouchableOpacity } from "react-native";
import { Heading } from "./ui/heading";
import { HStack } from "./ui/hstack";
import { Icon } from "./ui/icon";
import { Text } from "./ui/text";
import { VStack } from "./ui/vstack";
import { UserPhoto } from "./UserPhoto";

import defaultUserPhotoImg from "@assets/userPhotoDefault.png";
import { useToastMessage } from "@hooks/useToastMessage";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";

export function HomeHeader() {
  const { user, signOut } = useAuth();
  const { handleAlert } = useToastMessage();
  const navigation = useNavigation<AuthNavigationRoutesProps>();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigation.navigate("signIn");
    } catch (errors) {
      const error = errors as AppError;
      handleAlert({
        id: "sign-out-error",
        title: "Não foi possível sair da conta.",
        description: error.message,
        action: "error",
      });
    }
  };
  return (
    <HStack className="bg-gray-600 pt-16 pb-5 px-8 items-center gap-4">
      <UserPhoto
        source={
          user?.avatar
            ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
            : defaultUserPhotoImg
        }
        className="w-16 h-16"
        alt="User photo"
      />
      <VStack className="flex-1">
        <Text className="text-gray-100 text-sm">Olá,</Text>
        <Heading className="text-gray-100 text-md">{user.name}</Heading>
      </VStack>
      <TouchableOpacity onPress={handleSignOut}>
        <Icon as={LogOut} size="xl" className="text-gray-200" />
      </TouchableOpacity>
    </HStack>
  );
}
