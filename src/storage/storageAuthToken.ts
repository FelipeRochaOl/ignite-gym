import AsyncStorage from "@react-native-async-storage/async-storage";
import { REFRESH_TOKEN_STORAGE, TOKEN_STORAGE } from "./storageConfig";

export const storageTokenSave = async (token: string) => {
  await AsyncStorage.setItem(TOKEN_STORAGE, token);
};

export const storageTokenGet = async () => {
  return await AsyncStorage.getItem(TOKEN_STORAGE);
};

export const storageTokenRemove = async () => {
  await AsyncStorage.removeItem(TOKEN_STORAGE);
};

export const storageRefreshTokenSave = async (refreshToken: string) => {
  await AsyncStorage.setItem(REFRESH_TOKEN_STORAGE, refreshToken);
};

export const storageRefreshTokenGet = async () => {
  return await AsyncStorage.getItem(REFRESH_TOKEN_STORAGE);
};
