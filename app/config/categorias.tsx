import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CategoriasConfigScreen() {
	return (
		<SafeAreaView className="flex-1 bg-base-white">
			<Stack.Screen options={{ headerShown: false }} />
			<View className="flex-1 justify-center px-4">
				<Text className="font-mono-bold text-4xl leading-[48px] text-base-black">
					Categorias
				</Text>
			</View>
		</SafeAreaView>
	);
}
