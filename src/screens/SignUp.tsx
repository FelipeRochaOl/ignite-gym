import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigationRoutesProps } from "@routes/auth.routes";
import { Controller, useForm } from "react-hook-form";
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
import { SignUpDTO } from "@dtos/SignUpDTO";
import { useToastMessage } from "@hooks/useToastMessage";
import { AppError } from "@utils/AppError";
import { useState } from "react";

const signUpSchema = yup.object({
  name: yup
    .string()
    .required("Nome é obrigatório")
    .max(150, "Nome muito longo"),
  email: yup
    .string()
    .required("Email é obrigatório")
    .email("E-mail inválido")
    .max(150, "Email muito longo"),
  password: yup
    .string()
    .required("Senha é obrigatório")
    .min(6, "Senha deve ter no mínimo 6 caracteres"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), ""], "As senhas não coincidem")
    .required("Confirmação de senha é obrigatório"),
});

export function SignUp() {
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { handleAlert } = useToastMessage();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpDTO>({
    resolver: yupResolver(signUpSchema),
  });

  const navigator = useNavigation<AuthNavigationRoutesProps>();

  const handleGoBack = () => {
    navigator.goBack();
  };

  const onSubmit = async ({
    name,
    email,
    password,
    confirmPassword,
  }: SignUpDTO) => {
    try {
      setLoading(true);
      await signUp({ name, email, password, confirmPassword });
      await signIn({ email, password });
    } catch (errors) {
      const error = errors as AppError;
      handleAlert(
        {
          id: "1",
          title: "Erro ao criar conta",
          description: error.message,
          action: "error",
        },
        "top",
      );
    } finally {
      setLoading(false);
    }
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

            <Center className="flex-1 gap-2">
              <Heading className="color-gray-100">Crie sua conta</Heading>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Nome"
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

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Confirme a Senha"
                    keyboardType="visible-password"
                    secureTextEntry
                    onChangeText={onChange}
                    value={value}
                    returnKeyType="send"
                    onSubmitEditing={handleSubmit(onSubmit)}
                    isError={!!errors.confirmPassword}
                    messageError={errors.confirmPassword?.message}
                  />
                )}
              />

              <Button
                title="Criar e acessar"
                onPress={handleSubmit(onSubmit)}
                isLoading={loading}
              />
            </Center>

            <Button
              title="Voltar para o login"
              variant="outline"
              className="mt-12"
              onPress={handleGoBack}
            />
          </VStack>
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
