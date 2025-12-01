import { Loading } from "@components/Loading";
import { Box } from "@components/ui/box";
import { AppContextProvider } from "@contexts/AppContext";
import { useAuth } from "@contexts/AuthContext";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { AppRoutes } from "./app.routes";
import { AuthRoutes } from "./auth.routes";

export function Routes() {
  const { user, isLoadingStorageData } = useAuth();
  const theme = DefaultTheme;
  theme.colors.background = "bg-gray-700";

  if (isLoadingStorageData) {
    return <Loading />;
  }

  return (
    <Box className="flex-1 bg-gray-700">
      <NavigationContainer theme={theme}>
        {user?.id ? (
          <AppContextProvider>
            <AppRoutes />
          </AppContextProvider>
        ) : (
          <AuthRoutes />
        )}
      </NavigationContainer>
    </Box>
  );
}
