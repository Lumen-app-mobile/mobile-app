import { MaterialIcons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/layout/Header/Header";
import TextField from "@/components/ui/FormInput/FormInput";
import colors from "@/constants/colors";
import { useI18n } from "@/lib/i18n";
import { actualizarNombre } from "@/services/profile";

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
			className="h-[46px] w-[46px] items-center justify-center border-[3px] border-base-black bg-base-white shadow-[4px_4px_1px_black]">
			<MaterialIcons
				name={icon}
				size={24}
				color={colors.base.black}
			/>
		</Pressable>
	);
}

function SaveButton({
	label,
	accessibilityLabel,
	disabled,
	onPress,
}: {
	label: string;
	accessibilityLabel: string;
	disabled?: boolean;
	onPress: () => void;
}) {
	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel={accessibilityLabel}
			disabled={disabled}
			onPress={onPress}
			className="h-[46px] flex-row items-center gap-2 border-[3px] border-base-black bg-primary-v1 px-[19px] py-[11px] shadow-[4px_4px_0px_black]"
			style={{ opacity: disabled ? 0.45 : 1 }}>
			<MaterialIcons
				name="save"
				size={24}
				color={colors.base.white}
			/>
			<Text className="font-mono text-xs leading-4 text-base-white">
				{label}
			</Text>
		</Pressable>
	);
}

export default function PerfilConfigScreen() {
	const { t } = useI18n();
	const [name, setName] = useState("");
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

	async function handleSave() {
		const trimmed = name.trim();
		if (!trimmed) return;

		setSaving(true);
		setMessage(null);

		try {
			await actualizarNombre(trimmed);
			setMessage({ type: "success", text: "Nombre actualizado" });
		} catch {
			setMessage({ type: "error", text: "Error al guardar" });
		} finally {
			setSaving(false);
		}
	}

	return (
		<SafeAreaView className="flex-1 bg-base-white">
			<Stack.Screen options={{ headerShown: false }} />
			<Header />

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
								{t("profile.title")}
							</Text>
						</View>
					</View>

					<View className="w-[264px] gap-[18px] px-4">
						<TextField
							label={t("profile.name")}
							size="sm"
							placeholder="Tu nombre"
							autoCapitalize="words"
							value={name}
							onChangeText={setName}
						/>

						<SaveButton
							label={t("common.accept")}
							accessibilityLabel={t("profile.saveAccessibility")}
							disabled={saving || !name.trim()}
							onPress={handleSave}
						/>

						{message ? (
							<Text
								className={`font-mono text-xs leading-[15px] ${
									message.type === "success"
										? "text-feedback-success-v1"
										: "text-feedback-danger-v1"
								}`}>
								{message.text}
							</Text>
						) : null}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
