// App.js
import React, { useMemo } from "react";
import { Text } from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemeProvider, useTheme } from "./src/ThemeContext";

// screens
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import TrainerListScreen from "./src/screens/TrainerListScreen";
import TrainerDetailScreen from "./src/screens/TrainerDetailScreen";
import EatingScreen from "./src/screens/EatingScreen";
import BmiScreen from "./src/screens/BmiScreen";
import ProfileScreen from "./src/screens/ProfileScreen";

const RootStack = createNativeStackNavigator();
const TrainerStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- Trainer stack ---
function TrainerStackScreen() {
  return (
    <TrainerStack.Navigator screenOptions={{ headerShown: false }}>
      <TrainerStack.Screen name="TrainerList" component={TrainerListScreen} />
      <TrainerStack.Screen name="TrainerDetail" component={TrainerDetailScreen} />
    </TrainerStack.Navigator>
  );
}

const TAB_META = {
  Home: { emoji: "🏠", label: "Home" },
  Trainer: { emoji: "💪", label: "Trainer" },
  Eating: { emoji: "🥗", label: "Eating" },
  BMI: { emoji: "📊", label: "BMI" },
  Profile: { emoji: "👤", label: "Profile" },
};

// --- Tabs ---
function MainTabs() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const meta = TAB_META[route.name] || { emoji: "⬜️", label: route.name };
        return {
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.muted,
          tabBarStyle: {
            backgroundColor: colors.soft,
            borderTopColor: colors.border,
            height: 62 + Math.floor(insets.bottom * 0.4),
            paddingBottom: Math.max(insets.bottom, 10),
          },
          tabBarLabelStyle: { fontSize: 12, marginBottom: 2 },
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{meta.emoji}</Text>
          ),
          tabBarLabel: meta.label,
        };
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Trainer" component={TrainerStackScreen} />
      <Tab.Screen name="Eating" component={EatingScreen} />
      <Tab.Screen name="BMI" component={BmiScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AppInner() {
  const { colors, mode } = useTheme();
  const navTheme = useMemo(() => {
    const base = mode === "light" ? DefaultTheme : DarkTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background: colors.bg,
        card: colors.soft,
        text: colors.text,
        border: colors.border,
        primary: colors.primary,
      },
    };
  }, [colors, mode]);

  return (
    <NavigationContainer theme={navTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
        <RootStack.Screen name="Login" component={LoginScreen} />
        <RootStack.Screen name="Register" component={RegisterScreen} />
        <RootStack.Screen name="MainTabs" component={MainTabs} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AppInner />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
