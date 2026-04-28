import { MaterialIcons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/layout/Header/Header";
import TextField from "@/components/ui/FormInput/FormInput";
import colors from "@/constants/colors";
import { type TranslationKey, useI18n } from "@/lib/i18n";

type ProfileField = {
	key: keyof ProfileDraft;
	labelKey: TranslationKey;
	placeholder: string;
	secureTextEntry?: boolean;
};

type ProfileData = {
	name: string;
	email: string;
	password: string;
};

type ProfileDraft = {
	name: string;
	email: string;
	password: string;
	repeatedPassword: string;
};

const CURRENT_PROFILE: ProfileData = {
	email: "usuario@lumen.app",
	name: "Usuario Lumen",
	password: "",
};

const PROFILE_FIELDS: ProfileField[] = [
	{ key: "name", labelKey: "profile.name", placeholder: "placeholder" },
	{ key: "email", labelKey: "profile.email", placeholder: "placeholder" },
	{
		key: "password",
		labelKey: "profile.password",
		placeholder: "placeholder",
		secureTextEntry: true,
	},
	{
		key: "repeatedPassword",
		labelKey: "profile.repeatPassword",
		placeholder: "placeholder",
		secureTextEntry: true,
	},
];

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

function createInitialDraft(): ProfileDraft {
	return {
		email: "",
		name: "",
		password: "",
		repeatedPassword: "",
	};
}

function SaveButton({
	label,
	accessibilityLabel,
	onPress,
}: {
	label: string;
	accessibilityLabel: string;
	onPress: () => void;
}) {
	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel={accessibilityLabel}
			onPress={onPress}
			className="h-[46px] flex-row items-center gap-2 border-[3px] border-base-black bg-primary-v1 px-[19px] py-[11px] shadow-[4px_4px_0px_black]">
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

function ProfileFieldInput({
	field,
	label,
	placeholder,
	value,
	onChangeText,
}: {
	field: ProfileField;
	label: string;
	placeholder: string;
	value: string;
	onChangeText: (value: string) => void;
}) {
	return (
		<View className="w-[264px]">
			<TextField
				label={label}
				size="sm"
				placeholder={placeholder}
				secureTextEntry={field.secureTextEntry}
				autoCapitalize="none"
				value={value}
				onChangeText={onChangeText}
			/>
		</View>
	);
}

export default function PerfilConfigScreen() {
	const { t } = useI18n();
	const [profile, setProfile] = useState<ProfileData>(CURRENT_PROFILE);
	const [draft, setDraft] = useState<ProfileDraft>(() => createInitialDraft());

	function handleNotificationsPress() {}

	function updateDraftField(key: keyof ProfileDraft, value: string) {
		setDraft((currentDraft) => ({
			...currentDraft,
			[key]: value,
		}));
	}

	function getNextProfileValue(currentValue: string, draftValue: string) {
		const normalizedDraftValue = draftValue.trim();

		if (!normalizedDraftValue) return currentValue;

		return normalizedDraftValue;
	}

	function saveProfileDraft() {
		setProfile((currentProfile) => ({
			email: getNextProfileValue(currentProfile.email, draft.email),
			name: getNextProfileValue(currentProfile.name, draft.name),
			password:
				draft.password.trim() && draft.password === draft.repeatedPassword
					? draft.password
					: currentProfile.password,
		}));
		setDraft(createInitialDraft());
	}

	function getProfileFieldPlaceholder(field: ProfileField) {
		if (field.key === "name") return profile.name || field.placeholder;
		if (field.key === "email") return profile.email || field.placeholder;

		return field.placeholder;
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
								{t("profile.title")}
							</Text>
						</View>
					</View>

					<View className="gap-[18px] px-4">
						<View className="gap-4">
							{PROFILE_FIELDS.map((field) => (
								<ProfileFieldInput
									key={field.key}
									field={field}
									label={t(field.labelKey)}
									placeholder={getProfileFieldPlaceholder(field)}
									value={draft[field.key]}
									onChangeText={(value) => updateDraftField(field.key, value)}
								/>
							))}
						</View>
						<SaveButton
							label={t("common.accept")}
							accessibilityLabel={t("profile.saveAccessibility")}
							onPress={saveProfileDraft}
						/>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
