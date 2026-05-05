import { Redirect } from "expo-router";
import { View } from "react-native";

import { useAuth } from "@/lib/auth";

export default function Index() {
	const { isInitializing, user } = useAuth();

	if (isInitializing) return <View />;

	return <Redirect href={user ? "/(tabs)" : "/login"} />;
}
