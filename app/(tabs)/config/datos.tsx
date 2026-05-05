import { MaterialIcons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/layout/Header/Header";
import colors from "@/constants/colors";
import { useI18n } from "@/lib/i18n";

type DataActionVariant = "import" | "sync" | "export";

const ACTION_BUTTON_SHADOW = {
	shadowColor: colors.base.black,
	shadowOffset: { width: 4, height: 4 },
	shadowOpacity: 1,
	shadowRadius: 0,
	elevation: 5,
};

const ACTION_BUTTON_COLORS: Record<DataActionVariant, string> = {
	export: colors.feedback.danger.v1,
	import: colors.feedback.success.v1,
	sync: colors.feedback.info.v1,
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
			style={ACTION_BUTTON_SHADOW}>
			<MaterialIcons
				name={icon}
				size={24}
				color={colors.base.black}
			/>
		</Pressable>
	);
}

function DataActionButton({
	label,
	variant,
	onPress,
}: {
	label: string;
	variant: DataActionVariant;
	onPress: () => void;
}) {
	return (
		<View className="w-[170px] pr-1 pb-1">
			<Pressable
				accessibilityRole="button"
				accessibilityLabel={label}
				onPress={onPress}
				className="min-h-[39px] w-full flex-row items-center border-[3px] border-base-black px-[19px] py-[11px]"
				style={[
					ACTION_BUTTON_SHADOW,
					{ backgroundColor: ACTION_BUTTON_COLORS[variant] },
				]}>
				<Text
					numberOfLines={1}
					className="font-mono text-xs leading-4 text-base-white">
					{label}
				</Text>
			</Pressable>
		</View>
	);
}

export default function DatosConfigScreen() {
	const { t } = useI18n();

	function handleNotificationsPress() {}

	function showPendingCsvAction(actionLabel: string) {
		Alert.alert(actionLabel, t("data.csvPending"));
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
							<Text className="font-mono-bold text-4xl leading-[48px] text-base-black">
								{t("config.data")}
							</Text>
						</View>
					</View>

					<View className="gap-[18px] px-4">
						<DataActionButton
							label={t("data.import")}
							variant="import"
							onPress={() => showPendingCsvAction(t("data.import"))}
						/>
						<DataActionButton
							label={t("data.sync")}
							variant="sync"
							onPress={() => showPendingCsvAction(t("data.sync"))}
						/>
						<DataActionButton
							label={t("data.export")}
							variant="export"
							onPress={() => showPendingCsvAction(t("data.export"))}
						/>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
