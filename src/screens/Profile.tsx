import { yupResolver } from "@hookform/resolvers/yup";
import { File } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import * as yup from "yup";

import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { Center } from "@components/ui/center";
import { Heading } from "@components/ui/heading";
import { Text } from "@components/ui/text";
import { VStack } from "@components/ui/vstack";
import { UserPhoto } from "@components/UserPhoto";

import userPhotoDefault from "@assets/userPhotoDefault.png";
import { Loading } from "@components/Loading";
import { useAuth } from "@contexts/AuthContext";
import { ProfileDTO } from "@dtos/ProfileDTO";
import { useToastMessage } from "@hooks/useToastMessage";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { Controller, Resolver, useForm } from "react-hook-form";

const profileSchema = yup.object({
  name: yup.string().required("Informe o nome").max(150, "Nome muito longo"),
  email: yup.string().nullable(),
  password: yup
    .string()
    .nullable()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .transform((value) => (!!value ? value : null)),
  confirmPassword: yup
    .string()
    .nullable()
    .transform((value) => (!!value ? value : null))
    .oneOf([yup.ref("password"), null], "As senhas não coincidem")
    .when("password", (value, schema) => {
      const password = value as unknown as string | null;
      return typeof password === "string" && password.length > 0
        ? schema
            .required("Confirme a nova senha")
            .transform((value) => (!!value ? value : null))
        : schema.nullable();
    }),
  oldPassword: yup
    .string()
    .nullable()
    .transform((value) => (!!value ? value : null))
    .when("password", (value, schema) => {
      const password = value as unknown as string | null;
      return typeof password === "string" && password.length > 0
        ? schema
            .required("Informe a senha antiga")
            .transform((value) => (!!value ? value : null))
        : schema.nullable();
    })
    .min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export function Profile() {
  const [isLoading, setIsLoading] = useState(false);
  const { handleAlert } = useToastMessage();
  const { user, updateUser, updateUserAvatar, isLoadingStorageData } =
    useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileDTO>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema) as unknown as Resolver<ProfileDTO>,
  });

  const handleUserPhotoSelect = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      handleAlert(
        {
          id: "permission-denied-error",
          title: "Permissão negada",
          action: "error",
          description:
            "Você precisa primeiro liberar o acesso a biblioteca de fotos",
        },
        "top",
      );
      return;
    }

    const photoSelected = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
      allowsMultipleSelection: false,
    });

    if (photoSelected.canceled) return;

    const [image] = photoSelected.assets;
    const file = new File(image.uri);

    if (!file) {
      handleAlert(
        {
          id: "error-loading-image",
          title: "Erro ao carregar imagem",
          action: "error",
          description: "Não foi possível carregar a imagem selecionada.",
        },
        "top",
      );
      return;
    }

    const calcFileSizeMb = file.size / 1024 / 1024;
    if (calcFileSizeMb > 5) {
      handleAlert({
        id: "image-too-large-error",
        title: "Imagem muito grande",
        action: "error",
        description: "Essa imagem é muito grande. Escolha uma de até 5MB.",
      });
      return;
    }

    const avatarFile = new FormData();
    avatarFile.append("avatar", {
      uri: image.uri,
      name: `${file.name}`,
      type: file.type,
    } as any);

    try {
      setIsLoading(true);
      await updateUserAvatar(avatarFile);
      handleAlert(
        {
          id: "update-avatar-success",
          title: "Avatar atualizado com sucesso!",
          action: "success",
        },
        "top",
      );
    } catch (errors) {
      const error = errors as AppError;
      handleAlert(
        {
          id: "update-avatar-error",
          title: "Não foi possível atualizar o avatar",
          description: error.message,
          action: "error",
        },
        "top",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (data: ProfileDTO) => {
    try {
      setIsLoading(true);
      await updateUser(data);
      handleAlert(
        {
          id: "update-profile-success",
          title: "Perfil atualizado com sucesso!",
          action: "success",
        },
        "top",
      );
    } catch (errors) {
      const error = errors as AppError;
      handleAlert(
        {
          id: "update-profile-error",
          title: "Não foi possível atualizar o perfil",
          description: error.message,
          action: "error",
        },
        "top",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <VStack className="flex-1">
        <ScreenHeader title="Perfil" />

        {isLoadingStorageData ? (
          <Loading />
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
            <Center className="mt-6 px-10">
              <UserPhoto
                source={
                  user?.avatar
                    ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                    : userPhotoDefault
                }
                alt="Profile image"
                className="w-40 h-40 mt-6 mb-4"
                size="xl"
              />

              <TouchableOpacity onPress={handleUserPhotoSelect}>
                <Text className="text-green-500 font-heading text-md mt-2 mb-8">
                  Alterar foto
                </Text>
              </TouchableOpacity>

              <Center className="w-full gap-4">
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder="Nome"
                      className="text-white bg-gray-600"
                      onChangeText={onChange}
                      value={value}
                      isError={!!errors.name}
                      messageError={errors.name?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="email"
                  render={({ field: { value, onChange } }) => (
                    <Input
                      value={value ?? ""}
                      className="text-white bg-gray-600"
                      placeholder="E-mail"
                      onChangeText={onChange}
                      isReadOnly
                    />
                  )}
                />
              </Center>

              <Heading className="text-gray-200 text-md mt-12 mb-2 font-heading self-start">
                Alterar senha
              </Heading>
              <Center className="w-full gap-4 mb-8">
                <Controller
                  control={control}
                  name="oldPassword"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder="Senha antiga"
                      className="text-white bg-gray-600"
                      secureTextEntry
                      onChangeText={onChange}
                      value={value ?? ""}
                      isError={!!errors.oldPassword}
                      messageError={errors.oldPassword?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder="Nova senha"
                      className="text-white bg-gray-600"
                      secureTextEntry
                      onChangeText={onChange}
                      value={value ?? ""}
                      isError={!!errors.password}
                      messageError={errors.password?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder="Confirme a nova senha"
                      className="text-white bg-gray-600"
                      secureTextEntry
                      onChangeText={onChange}
                      value={value ?? ""}
                      isError={!!errors.confirmPassword}
                      messageError={errors.confirmPassword?.message}
                    />
                  )}
                />
              </Center>

              <Button
                title="Atualizar"
                onPress={handleSubmit(handleProfileUpdate)}
                isLoading={isLoading}
              />
            </Center>
          </ScrollView>
        )}
      </VStack>
    </KeyboardAvoidingView>
  );
}
