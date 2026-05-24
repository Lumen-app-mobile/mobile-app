import { MaterialIcons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/layout/Header/Header";
import colors from "@/constants/colors";
import {
	type AppLanguage,
	LANGUAGE_OPTIONS,
	useI18n,
} from "@/lib/i18n";

type DropdownOption = {
	label: string;
	value: string;
};

type OpenDropdown = "language" | "currency" | null;

const CURRENCY_OPTIONS: DropdownOption[] = [
	{ label: "Euro (EUR)", value: "eur" },
	{ label: "US Dollar (USD)", value: "usd" },
	{ label: "Pound Sterling (GBP)", value: "gbp" },
	{ label: "Swiss Franc (CHF)", value: "chf" },
	{ label: "Japanese Yen (JPY)", value: "jpy" },
	{ label: "Mexican Peso (MXN)", value: "mxn" },
	{ label: "Argentine Peso (ARS)", value: "ars" },
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

function PreferenceDropdown({
	label,
	options,
	selectedValue,
	isOpen,
	onToggle,
	onSelect,
}: {
	label: string;
	options: DropdownOption[];
	selectedValue: string;
	isOpen: boolean;
	onToggle: () => void;
	onSelect: (option: DropdownOption) => void;
}) {
	return (
		<View className="w-[259px]">
			<Pressable
				accessibilityRole="button"
				accessibilityLabel={label}
				accessibilityState={{ expanded: isOpen }}
				onPress={onToggle}
				className="h-[42px] w-full flex-row items-center justify-between border border-base-black bg-base-white px-4 py-2 shadow-[4px_4px_1px_black]">
				<Text
					numberOfLines={1}
					className="shrink font-mono text-base leading-5 text-base-black">
					{label}
				</Text>
				<MaterialIcons
					name={isOpen ? "arrow-upward" : "arrow-downward"}
					size={24}
					color={colors.base.black}
				/>
			</Pressable>

			{isOpen ? (
				<View className="mt-1 w-full border border-base-black bg-base-white shadow-[4px_4px_1px_black]">
					{options.map((option) => {
						const isSelected = option.value === selectedValue;

						return (
							<Pressable
								key={option.value}
								accessibilityRole="button"
								accessibilityState={{ selected: isSelected }}
								onPress={() => onSelect(option)}
								className={`flex-row items-center justify-between px-4 py-2 ${
									isSelected ? "bg-primary-v1" : "bg-base-white"
								}`}>
								<Text
									numberOfLines={1}
									className={`shrink font-mono text-sm leading-[18px] ${
										isSelected ? "text-base-white" : "text-base-black"
									}`}>
									{option.label}
								</Text>
								{isSelected ? (
									<MaterialIcons
										name="check"
										size={18}
										color={colors.base.white}
									/>
								) : null}
							</Pressable>
						);
					})}
				</View>
			) : null}
		</View>
	);
}

export default function PreferenciasConfigScreen() {
	const { language, setLanguage, t } = useI18n();
	const [currency, setCurrency] = useState(CURRENCY_OPTIONS[0]);
	const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);

	const selectedLanguage =
		LANGUAGE_OPTIONS.find((option) => option.value === language) ??
		LANGUAGE_OPTIONS[0];

	function toggleDropdown(dropdown: Exclude<OpenDropdown, null>) {
		setOpenDropdown((currentDropdown) =>
			currentDropdown === dropdown ? null : dropdown,
		);
	}

	function selectLanguage(option: DropdownOption) {
		setLanguage(option.value as AppLanguage);
		setOpenDropdown(null);
	}

	function selectCurrency(option: DropdownOption) {
		setCurrency(option);
		setOpenDropdown(null);
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
							<Text className="font-mono-bold text-[34px] leading-[48px] text-base-black">
								{t("preferences.title")}
							</Text>
						</View>
					</View>

					<View className="w-full gap-[18px] px-4">
						<PreferenceDropdown
							label={selectedLanguage.label}
							options={LANGUAGE_OPTIONS}
							selectedValue={language}
							isOpen={openDropdown === "language"}
							onToggle={() => toggleDropdown("language")}
							onSelect={selectLanguage}
						/>
						<PreferenceDropdown
							label={currency.label}
							options={CURRENCY_OPTIONS}
							selectedValue={currency.value}
							isOpen={openDropdown === "currency"}
							onToggle={() => toggleDropdown("currency")}
							onSelect={selectCurrency}
						/>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
