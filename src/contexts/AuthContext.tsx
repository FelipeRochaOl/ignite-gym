import { ProfileDTO } from "@dtos/ProfileDTO";
import { SignInDTO } from "@dtos/SignInDTO";
import { SignUpDTO } from "@dtos/SignUpDTO";
import { api } from "@services/api";
import { login } from "@services/sessions";
import { register, updateAvatar, updateUserProfile } from "@services/users";
import {
  storageRefreshTokenGet,
  storageRefreshTokenSave,
  storageTokenGet,
  storageTokenRemove,
  storageTokenSave,
} from "@storage/storageAuthToken";
import {
  storageUserGet,
  storageUserRemove,
  storageUserSave,
} from "@storage/storageUser";
import { createContext, useContext, useEffect, useState } from "react";
import { UserDTO } from "../dtos/UserDTO";

export interface AuthContextData {
  user: UserDTO;
  isLoadingStorageData: boolean;
  signIn: (data: SignInDTO) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (data: SignUpDTO) => Promise<void>;
  updateUser: (user: ProfileDTO) => Promise<void>;
  updateUserAvatar: (avatarFile: FormData) => Promise<void>;
}

type AuthContextProviderProps = {
  children: React.ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO);
  const [isLoadingStorageData, setIsLoadingStorageData] = useState(true);

  const addUserAndToken = async (
    user: UserDTO,
    token: string,
    refreshToken: string,
  ) => {
    await storageUserSave(user);
    await storageTokenSave(token);
    await storageRefreshTokenSave(refreshToken);
    addTokenToApiHeaders(token);
    setUser(user);
  };

  const removeUserAndToken = async () => {
    await storageUserRemove();
    await storageTokenRemove();
    removeTokenFromApiHeaders();
    setUser({} as UserDTO);
  };

  const addTokenToApiHeaders = (token: string) => {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const removeTokenFromApiHeaders = () => {
    delete api.defaults.headers.common["Authorization"];
  };

  const signIn = async ({ email, password }: SignInDTO) => {
    try {
      setIsLoadingStorageData(true);
      const { user, token, refresh_token } = await login({ email, password });
      if (!user || !token || !refresh_token)
        throw new Error("Ocorreu um erro ao fazer login.");
      await addUserAndToken(user, token, refresh_token);
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingStorageData(false);
    }
  };

  const signOut = async () => {
    try {
      await removeUserAndToken();
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingStorageData(false);
    }
  };

  const signUp = async ({
    name,
    email,
    password,
    confirmPassword,
  }: SignUpDTO) => {
    try {
      await register({
        name,
        email,
        password,
        confirmPassword,
      });
    } catch (error) {
      throw error;
    }
  };

  const updateUser = async (profile: ProfileDTO) => {
    const updatedUser: UserDTO = {
      ...user,
      name: profile.name,
    };
    await updateUserProfile(profile);
    await storageUserSave(updatedUser);
    setUser(updatedUser);
  };

  const updateUserAvatar = async (avatarFile: FormData) => {
    const userUpdated = await updateAvatar(avatarFile);
    await storageUserSave(userUpdated);
    setUser(userUpdated);
  };

  const getUserStorageData = async () => {
    try {
      const user = await storageUserGet();
      const token = await storageTokenGet();
      const refreshToken = await storageRefreshTokenGet();
      if (token && user?.id && refreshToken) {
        addUserAndToken(user, token, refreshToken);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingStorageData(false);
    }
  };

  useEffect(() => {
    getUserStorageData();
  }, []);

  useEffect(() => {
    // registra o signOut no interceptador do axios, assim que carregar o contexto (app)
    const subscribe = api.registerInterceptTokenManager(signOut);
    // limpa da memória o interceptador quando o contexto for desmontado
    return () => {
      subscribe();
    };
  }, [signOut]);

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        signUp,
        updateUser,
        isLoadingStorageData,
        updateUserAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
