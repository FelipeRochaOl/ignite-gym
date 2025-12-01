import { NavigatorScreenParams } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import { Exercise } from "@screens/Exercise";
import { TabRoutes } from "./tab.routes";

type AppRoutes = {
  tabs: NavigatorScreenParams<TabRoutes>;
  exercise: { id: number };
};

export type AppNavigationRoutesProps = NativeStackNavigationProp<AppRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<AppRoutes>();

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="tabs" component={TabRoutes} />
      <Screen name="exercise" component={Exercise} />
    </Navigator>
  );
}
