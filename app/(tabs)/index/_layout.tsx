import { Stack } from "expo-router";

export default function HomeLayout() {
	return (
		<Stack
			screenOptions={{ headerShown: false }}
			initialRouteName="home">
			<Stack.Screen name="home" />
			<Stack.Screen name="recibo/[id]" />
		</Stack>
	);
}
