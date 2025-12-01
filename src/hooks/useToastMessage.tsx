import { ToastMessage, ToastMessageProps } from "@components/ToastMessage";
import { useToast } from "@components/ui/toast";
import { ToastPlacement } from "@gluestack-ui/core/lib/esm/toast/creator/types";

export const useToastMessage = () => {
  const toast = useToast();

  const handleAlert = (
    { id, title, action, description }: ToastMessageProps,
    placement?: ToastPlacement,
  ) => {
    return toast.show({
      placement,
      id,
      render: () => (
        <ToastMessage
          id={id}
          title={title}
          description={description}
          action={action}
          onClose={() => toast.close(id)}
        />
      ),
    });
  };

  return { handleAlert };
};
