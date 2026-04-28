import {
	RedHatMono_400Regular,
	RedHatMono_500Medium,
	RedHatMono_700Bold,
	useFonts,
} from "@expo-google-fonts/red-hat-mono";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { I18nProvider } from "@/lib/i18n";

import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		RedHatMono_400Regular,
		RedHatMono_500Medium,
		RedHatMono_700Bold,
	});

	useEffect(() => {
		if (fontsLoaded) SplashScreen.hideAsync();
	}, [fontsLoaded]);

	if (!fontsLoaded) return <View />;

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<BottomSheetModalProvider>
				<I18nProvider>
					<Stack screenOptions={{ headerShown: false }}>
						<Stack.Screen name="index" />
						<Stack.Screen name="login" />
						<Stack.Screen name="(tabs)" />
						<Stack.Screen name="config" />
						<Stack.Screen name="productos/[id]" />
					</Stack>
				</I18nProvider>
			</BottomSheetModalProvider>
		</GestureHandlerRootView>
	);
}
