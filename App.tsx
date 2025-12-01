import "@/global.css";

import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import { StatusBar } from "expo-status-bar";

import { GluestackUIProvider } from "@components/ui/gluestack-ui-provider";

import { Loading } from "@components/Loading";
import { AuthContextProvider } from "@contexts/AuthContext";
import { Routes } from "@routes/index";

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  return (
    <GluestackUIProvider mode="dark">
      <StatusBar style="inverted" backgroundColor="transparent" translucent />
      <AuthContextProvider>
        {fontsLoaded ? <Routes /> : <Loading />}
      </AuthContextProvider>
    </GluestackUIProvider>
  );
}
