import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";

import { History } from "@screens/History";
import { Home } from "@screens/Home";
import { Profile } from "@screens/Profile";

import HistorySvg from "@assets/history.svg";
import HomeSvg from "@assets/home.svg";
import ProfileSvg from "@assets/profile.svg";
import { colors } from "../theme/colors";
import { spaces } from "../theme/spaces";

export type TabRoutes = {
  home: undefined;
  history: undefined;
  profile: undefined;
};

export type TabNavigationRoutesProps = BottomTabNavigationProp<TabRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<TabRoutes>();

export function TabRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.green_500,
        tabBarInactiveTintColor: colors.gray_200,
        tabBarStyle: {
          backgroundColor: colors.gray_600,
          borderTopWidth: 0,
          height: 88,
          paddingBottom: spaces[10],
          paddingTop: spaces[6],
        },
      }}
    >
      <Screen
        name="home"
        component={Home}
        options={{ tabBarIcon: ({ color }) => <HomeSvg fill={color} /> }}
      />
      <Screen
        name="history"
        component={History}
        options={{ tabBarIcon: ({ color }) => <HistorySvg fill={color} /> }}
      />
      <Screen
        name="profile"
        component={Profile}
        options={{ tabBarIcon: ({ color }) => <ProfileSvg fill={color} /> }}
      />
    </Navigator>
  );
}
