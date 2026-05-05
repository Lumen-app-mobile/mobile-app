import { MaterialIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { Stack, router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/layout/Header/Header";
import colors from "@/constants/colors";
import { useI18n } from "@/lib/i18n";

type InformationItem = {
	label: string;
	value: string;
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

function InformationRow({ label, value }: InformationItem) {
	return (
		<View
			className="w-[263px] gap-1 border-b-[3px] border-l-[3px] border-base-black bg-base-white px-3 py-3"
			style={ACTION_SHADOW_STYLE}>
			<Text
				numberOfLines={1}
				className="font-mono text-xs leading-[15px] text-base-black">
				{label}
			</Text>
			<Text
				numberOfLines={1}
				className="font-mono-bold text-base leading-5 text-base-black">
				{value}
			</Text>
		</View>
	);
}

function getRuntimeValue(value: string | null | undefined, fallback = "-") {
	return value && value.trim().length > 0 ? value : fallback;
}

export default function InformacionConfigScreen() {
	const { t } = useI18n();
	const appName = getRuntimeValue(Constants.expoConfig?.name, "lumen");
	const appVersion = getRuntimeValue(Constants.expoConfig?.version);
	const runtimeVersion = getRuntimeValue(Constants.expoConfig?.runtimeVersion?.toString());
	const appScheme = getRuntimeValue(Constants.expoConfig?.scheme?.toString());

	const informationItems: InformationItem[] = [
		{ label: t("information.appName"), value: appName },
		{ label: t("information.softwareVersion"), value: appVersion },
		{ label: t("information.runtimeVersion"), value: runtimeVersion },
		{ label: t("information.scheme"), value: appScheme },
	];

	function handleNotificationsPress() {}

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
								{t("config.information")}
							</Text>
						</View>
					</View>

					<View className="gap-[18px] px-4">
						{informationItems.map((item) => (
							<InformationRow
								key={item.label}
								{...item}
							/>
						))}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
