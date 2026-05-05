import { MaterialIcons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/layout/Header/Header";
import colors from "@/constants/colors";
import { useI18n } from "@/lib/i18n";

type NotificationOptionKey = "reminders" | "weeklySummary" | "push";

type NotificationOption = {
	key: NotificationOptionKey;
	label: string;
};

const ACTION_SHADOW_STYLE = {
	shadowColor: colors.base.black,
	shadowOffset: { width: 4, height: 4 },
	shadowOpacity: 1,
	shadowRadius: 1,
	elevation: 5,
};

function IconButton({
	icon,
	accessibilityLabel,
	onPress,
}: {
	icon: keyof typeof MaterialIcons.glyphMap;
	accessibilityLabel: string;
	onPress: () => void;
}) {
	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel={accessibilityLabel}
			onPress={onPress}
			className="h-[46px] w-[46px] items-center justify-center border-[3px] border-base-black bg-base-white"
			style={ACTION_SHADOW_STYLE}>
			<MaterialIcons
				name={icon}
				size={24}
				color={colors.base.black}
			/>
		</Pressable>
	);
}

function NotificationToggle({
	label,
	enabled,
	onPress,
}: {
	label: string;
	enabled: boolean;
	onPress: () => void;
}) {
	return (
		<Pressable
			accessibilityRole="switch"
			accessibilityState={{ checked: enabled }}
			accessibilityLabel={label}
			onPress={onPress}
			className="h-[37px] w-[263px] flex-row items-center justify-between">
			<Text
				numberOfLines={1}
				className="shrink font-mono text-xs leading-[15px] text-base-black">
				{label}
			</Text>
			<View
				style={{
					backgroundColor: enabled ? colors.primary.v1 : colors.secondary.v1,
					borderRadius: 999,
					height: 37,
					justifyContent: "center",
					paddingHorizontal: 6,
					width: 76,
				}}>
				<View
					style={{
						alignSelf: enabled ? "flex-end" : "flex-start",
						backgroundColor: colors.base.white,
						borderRadius: 999,
						height: 26,
						width: 26,
					}}
				/>
			</View>
		</Pressable>
	);
}

export default function NotificacionesConfigScreen() {
	const { t } = useI18n();
	const [settings, setSettings] = useState<Record<NotificationOptionKey, boolean>>({
		push: false,
		reminders: false,
		weeklySummary: false,
	});

	const notificationOptions: NotificationOption[] = [
		{ key: "reminders", label: t("notifications.reminders") },
		{ key: "weeklySummary", label: t("notifications.weeklySummary") },
		{ key: "push", label: t("notifications.push") },
	];

	function handleNotificationsPress() {}

	function toggleNotification(key: NotificationOptionKey) {
		setSettings((currentSettings) => ({
			...currentSettings,
			[key]: !currentSettings[key],
		}));
	}

	return (
		<SafeAreaView className="flex-1 bg-base-white">
			<Stack.Screen options={{ headerShown: false }} />
			<Header onNotificationsPress={handleNotificationsPress} />

			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				alwaysBounceVertical={false}
				contentContainerClassName="pb-8">
				<View className="gap-4 pt-4">
					<View className="w-full px-4">
						<View className="flex-row items-center gap-4">
							<IconButton
								icon="arrow-back"
								accessibilityLabel={t("common.backToConfig")}
								onPress={() => router.back()}
							/>
							<Text
								numberOfLines={1}
								adjustsFontSizeToFit
								className="min-w-0 flex-1 font-mono-bold text-4xl leading-[48px] text-base-black">
								{t("config.notifications")}
							</Text>
						</View>
					</View>

					<View className="gap-[18px] px-4">
						{notificationOptions.map((option) => (
							<NotificationToggle
								key={option.key}
								label={option.label}
								enabled={settings[option.key]}
								onPress={() => toggleNotification(option.key)}
							/>
						))}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
