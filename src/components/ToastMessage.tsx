import { X } from "lucide-react-native";
import { Pressable } from "react-native";
import { HStack } from "./ui/hstack";
import { Icon } from "./ui/icon";
import { Toast, ToastDescription, ToastTitle } from "./ui/toast";
import { VStack } from "./ui/vstack";

export type ToastMessageProps = {
  id: string;
  title: string;
  description?: string;
  action?: "success" | "error" | "info";
};

type Props = ToastMessageProps & {
  onClose: () => void;
};

export function ToastMessage({
  id,
  title,
  description,
  action = "info",
  onClose,
}: Props) {
  const colorScheme = {
    success: "green-500",
    error: "error-500",
    info: "info-500",
  };
  const toastClass = `bg-${colorScheme[action]} mt-10 mx-4 px-4 py-3 rounded-lg shadow-lg`;
  return (
    <Toast nativeID={`toast-${id}`} action={action} className={toastClass}>
      <VStack space="xs" className="w-full">
        <HStack className="w-full justify-between">
          <ToastTitle className="text-white font-heading" numberOfLines={1}>
            {title}
          </ToastTitle>
          <Pressable onPress={onClose} className="self-end">
            <Icon as={X} size="md" className="text-gray-50" />
          </Pressable>
        </HStack>
        {description && (
          <ToastDescription className="text-white font-body">
            {description}
          </ToastDescription>
        )}
      </VStack>
    </Toast>
  );
}
