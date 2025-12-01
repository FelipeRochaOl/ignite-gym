// Ref: https://github.com/rocketseat-education/ignite-rn-04-ignite-gym/blob/main/mobile/src/services/api.ts

import {
  storageRefreshTokenGet,
  storageRefreshTokenSave,
  storageTokenSave,
} from "@storage/storageAuthToken";
import { AppError } from "@utils/AppError";
import axios, { AxiosError, AxiosInstance } from "axios";

type SignOut = () => Promise<void>;

type ApiInstance = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void;
};

type FailedRequest = {
  onSuccess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
};

const api = axios.create({
  baseURL: "http://192.168.0.8:3333",
  headers: {
    "Content-Type": "application/json",
  },
}) as ApiInstance;

api.registerInterceptTokenManager = (signOut) => {
  const interceptTokenManager = api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error?.response?.status === 401) {
        return handleUnauthorizedError(signOut, error);
      }
      if (error?.response && error.response.data) {
        return Promise.reject(new AppError(error.response.data.message));
      }
      return Promise.reject(
        new AppError(
          "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.",
        ),
      );
    },
  );

  return () => {
    api.interceptors.response.eject(interceptTokenManager);
  };
};

let failedQueue: FailedRequest[] = [];

const handleUnauthorizedError = async (signOut: SignOut, error: any) => {
  const refreshToken = await storageRefreshTokenGet();

  if (!refreshToken) {
    signOut();
    return Promise.reject(
      new AppError("Sessão expirada. Por favor, faça login novamente."),
    );
  }

  const originalRequest = error.config;

  if (originalRequest._retry) {
    return new Promise((resolve, reject) => {
      failedQueue.push({
        onSuccess: (token: string) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          resolve(api(originalRequest));
        },
        onFailure: (err: AxiosError) => {
          reject(err);
        },
      });
    });
  }

  originalRequest._retry = true;

  try {
    const { data } = await api.post("/sessions/refresh-token", {
      refresh_token: refreshToken,
    });
    const { token: newToken, refresh_token: newRefreshToken } = data;

    failedQueue.forEach((request) => {
      request.onSuccess(newToken);
    });

    await storageTokenSave(newToken);
    await storageRefreshTokenSave(newRefreshToken);

    originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
    return api(originalRequest);
  } catch (err) {
    failedQueue.forEach((request) => {
      request.onFailure(err as AxiosError);
    });
    signOut();
    return Promise.reject(err);
  } finally {
    failedQueue = [];
    originalRequest._retry = false;
  }
};

export { api };
