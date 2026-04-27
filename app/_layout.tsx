import {
	RedHatMono_400Regular,
	RedHatMono_500Medium,
	RedHatMono_700Bold,
	useFonts,
} from "@expo-google-fonts/red-hat-mono";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { View } from "react-native";

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
		<I18nProvider>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name="index" />
				<Stack.Screen name="login" />
				<Stack.Screen name="(tabs)" />
				<Stack.Screen name="config" />
			</Stack>
		</I18nProvider>
	);
}
