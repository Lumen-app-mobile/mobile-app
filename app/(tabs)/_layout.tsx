import { Redirect, Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

import BottomNavBar from "@/components/navigation/BottomNavBar/BottomNavBar";
import { useAuth } from "@/lib/auth";

export default function TabLayout() {
	const { isInitializing, user } = useAuth();

	if (isInitializing) return <View />;
	if (!user) return <Redirect href="/login" />;

	return (
		<Tabs
			tabBar={(props) => <BottomNavBar {...props} />}
			screenOptions={{ headerShown: false }}>
			<Tabs.Screen name="index" options={{ title: "Home" }} />
			<Tabs.Screen name="productos" options={{ title: "Productos" }} />
			<Tabs.Screen name="scan" options={{ title: "Scan" }} />
			<Tabs.Screen name="config" options={{ title: "Config" }} />
		</Tabs>
	);
}
