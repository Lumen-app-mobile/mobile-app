import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Link, Stack, router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/layout/Header/Header";
import TextField from "@/components/ui/FormInput/FormInput";
import colors from "@/constants/colors";

type ProfileField = {
	key: keyof ProfileDraft;
	label: string;
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

type ConfigTab = {
	href: "/(tabs)" | "/(tabs)/productos" | "/(tabs)/scan" | "/(tabs)/config";
	icon: keyof typeof MaterialIcons.glyphMap;
	label: string;
	isActive?: boolean;
};

const CURRENT_PROFILE: ProfileData = {
	email: "usuario@lumen.app",
	name: "Usuario Lumen",
	password: "",
};

const PROFILE_FIELDS: ProfileField[] = [
	{ key: "name", label: "Nombre", placeholder: "placeholder" },
	{ key: "email", label: "email", placeholder: "placeholder" },
	{ key: "password", label: "Contraseña", placeholder: "placeholder", secureTextEntry: true },
	{
		key: "repeatedPassword",
		label: "Repetir contraseña",
		placeholder: "placeholder",
		secureTextEntry: true,
	},
];

const CONFIG_TABS: ConfigTab[] = [
	{ href: "/(tabs)", icon: "home", label: "HOME" },
	{ href: "/(tabs)/productos", icon: "list-alt", label: "PRODUCTOS" },
	{ href: "/(tabs)/scan", icon: "qr-code", label: "SCAN" },
	{ href: "/(tabs)/config", icon: "settings", label: "CONFIG", isActive: true },
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

function SaveButton({ onPress }: { onPress: () => void }) {
	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel="Aceptar cambios de perfil"
			onPress={onPress}
			className="h-[46px] flex-row items-center gap-2 border-[3px] border-base-black bg-primary-v1 px-[19px] py-[11px] shadow-[4px_4px_0px_black]">
			<MaterialIcons
				name="save"
				size={24}
				color={colors.base.white}
			/>
			<Text className="font-mono text-xs leading-4 text-base-white">
				Aceptar
			</Text>
		</Pressable>
	);
}

function ProfileFieldInput({
	field,
	placeholder,
	value,
	onChangeText,
}: {
	field: ProfileField;
	placeholder: string;
	value: string;
	onChangeText: (value: string) => void;
}) {
	return (
		<View className="w-[264px]">
			<TextField
				label={field.label}
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

function ConfigBottomNavigation() {
	return (
		<View className="bg-base-white px-[10px] pb-[26px]">
			<View className="w-full max-w-[448px] flex-row self-center border-[3px] border-base-black bg-base-white p-[3px] shadow-[4px_4px_1px_black]">
				{CONFIG_TABS.map((tab) => {
					const content = (
						<View
							className={`min-w-0 flex-1 items-center justify-center gap-1 p-3 ${
								tab.isActive
									? "border-[3px] border-primary-v1 bg-primary-v1"
									: "border-[3px] border-primary-v1 bg-base-white"
							}`}>
							<MaterialIcons
								name={tab.icon}
								size={24}
								color={tab.isActive ? colors.base.white : colors.primary.v1}
							/>
							<Text
								numberOfLines={1}
								adjustsFontSizeToFit
								className={`font-mono-bold text-xs uppercase leading-[15px] ${
									tab.isActive ? "text-base-white" : "text-primary-v1"
								}`}>
								{tab.label}
							</Text>
						</View>
					);

					if (tab.isActive) {
						return (
							<Pressable
								key={tab.label}
								disabled
								className="min-w-0 flex-1">
								{content}
							</Pressable>
						);
					}

					return (
						<Link
							key={tab.label}
							href={tab.href}
							asChild>
							<Pressable className="min-w-0 flex-1">{content}</Pressable>
						</Link>
					);
				})}
			</View>
		</View>
	);
}

export default function PerfilConfigScreen() {
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
								accessibilityLabel="Volver a configuración"
								onPress={() => router.back()}
							/>
							<Text className="font-mono-bold text-4xl leading-[48px] text-base-black">
								Perfil
							</Text>
						</View>
					</View>

					<View className="gap-[18px] px-4">
						<View className="gap-4">
							{PROFILE_FIELDS.map((field) => (
								<ProfileFieldInput
									key={field.key}
									field={field}
									placeholder={getProfileFieldPlaceholder(field)}
									value={draft[field.key]}
									onChangeText={(value) => updateDraftField(field.key, value)}
								/>
							))}
						</View>
						<SaveButton onPress={saveProfileDraft} />
					</View>
				</View>
			</ScrollView>

			<ConfigBottomNavigation />
		</SafeAreaView>
	);
}
