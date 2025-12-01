import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigationRoutesProps } from "@routes/auth.routes";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import * as yup from "yup";

import BackgroundImg from "@assets/background.png";
import LogoImg from "@assets/logo.svg";

import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { Center } from "@components/ui/center";
import { Heading } from "@components/ui/heading";
import { Image } from "@components/ui/image";
import { Text } from "@components/ui/text";
import { VStack } from "@components/ui/vstack";
import { useAuth } from "@contexts/AuthContext";
import { SignInDTO } from "@dtos/SignInDTO";
import { useToastMessage } from "@hooks/useToastMessage";
import { AppError } from "@utils/AppError";
import { useState } from "react";

const signInSchema = yup.object({
  email: yup
    .string()
    .required("Informe o e-mail")
    .email("E-mail inválido")
    .max(150, "Email muito longo"),
  password: yup
    .string()
    .required("Informe a senha")
    .min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export function SignIn() {
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { handleAlert } = useToastMessage();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInDTO>({
    resolver: yupResolver(signInSchema),
  });

  const onSubmit: SubmitHandler<SignInDTO> = async (data) => {
    try {
      setLoading(true);
      await signIn(data);
    } catch (errors) {
      const error = errors as AppError;
      handleAlert(
        {
          id: "1",
          title: "Não foi possível entrar",
          description: error.message,
          action: "error",
        },
        "top",
      );
    } finally {
      setLoading(false);
    }
  };

  const navigator = useNavigation<AuthNavigationRoutesProps>();

  const handleNewAccount = () => {
    navigator.navigate("signUp");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <VStack className="flex-1">
          <Image
            className="w-full h-624 absolute"
            source={BackgroundImg}
            defaultSource={BackgroundImg}
            alt="People training"
          />

          <VStack className="flex-1 px-10 pb-16 gap-2">
            <Center className="my-24">
              <LogoImg />
              <Text className="text-gray-100 text-sm">
                Treine sua mente e seu corpo
              </Text>
            </Center>

            <Center className="gap-2">
              <Heading className="color-gray-100">Acesse a conta</Heading>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="E-mail"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={onChange}
                    value={value}
                    isError={!!errors.email}
                    messageError={errors.email?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Senha"
                    keyboardType="visible-password"
                    secureTextEntry
                    onChangeText={onChange}
                    value={value}
                    isError={!!errors.password}
                    messageError={errors.password?.message}
                  />
                )}
              />
              <Button title="Acessar" onPress={handleSubmit(onSubmit)} />
            </Center>

            <Center className="flex-1 justify-end mt-4">
              <Text className="color-gray-100 text-sm pb-3 font-body">
                Ainda não tem acesso?
              </Text>
              <Button
                title="Criar conta"
                variant="outline"
                onPress={handleNewAccount}
                isLoading={loading}
              />
            </Center>
          </VStack>
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
