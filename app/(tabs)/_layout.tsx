import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tabBarActiveTintColor = "#0a7ea4";
  const tabBarInactiveTintColor = "#9E9E9E";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor,
        tabBarInactiveTintColor,
        tabBarStyle: {
          backgroundColor,
          borderTopColor: "#E0E0E0",
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor,
        },
        headerTintColor: textColor,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerTitle: "Detector de Focos da Dengue",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-analyses"
        options={{
          title: "Minhas Análises",
          headerTitle: "Minhas Análises",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="analytics" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
