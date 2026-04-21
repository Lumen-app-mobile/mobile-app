import { Tabs } from "expo-router";
import React from "react";
import BottomNavBar from "@/components/BottomNavBar";

export default function TabLayout() {
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
