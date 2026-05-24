import { MaterialIcons } from "@expo/vector-icons";
import { Link, router, type Href } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TitleDecorator from "@/assets/images/Vector(1).svg";
import Header from "@/components/layout/Header/Header";
import colors from "@/constants/colors";
import { useAuth } from "@/lib/auth";
import { type TranslationKey, useI18n } from "@/lib/i18n";

type ConfigItem = {
	labelKey: TranslationKey;
	icon: keyof typeof MaterialIcons.glyphMap;
	href: Href;
};

const SYSTEM_ITEMS: ConfigItem[] = [
	{
		labelKey: "config.profile",
		icon: "person-outline",
		href: "/config/perfil",
	},
	{
		labelKey: "config.preferences",
		icon: "tune",
		href: "/config/preferencias",
	},
	{
		labelKey: "config.categories",
		icon: "category",
		href: "/config/categorias",
	},
	{
		labelKey: "config.facturas",
		icon: "receipt-long",
		href: "/config/facturas" as Href,
	},
	{
		labelKey: "config.data",
		icon: "dataset",
		href: "/config/datos",
	},
	{
		labelKey: "config.salary",
		icon: "euro",
		href: "/config/sueldo",
	},
	{
		labelKey: "config.information",
		icon: "info-outline",
		href: "/config/informacion",
	},
];

const LIST_ITEM_SHADOW_STYLE = {
	shadowColor: colors.base.black,
	shadowOffset: { width: 4, height: 4 },
	shadowOpacity: 1,
	shadowRadius: 1,
	elevation: 5,
};

function SectionHeading({ title }: { title: string }) {
	return (
		<View className="w-full flex-row items-center gap-2 bg-primary-v1 px-4 py-2">
			<TitleDecorator
				width={50}
				height={26}
			/>
			<Text
				numberOfLines={1}
				adjustsFontSizeToFit
				className="font-mono-bold text-xl leading-[26px] text-base-white">
				{title}
			</Text>
		</View>
	);
}

function ConfigListItem({
	label,
	icon,
	href,
}: ConfigItem & {
	label: string;
}) {
	return (
		<Link
			href={href}
			asChild>
			<Pressable
				accessibilityRole="link"
				accessibilityLabel={label}
				className="w-full min-w-[160px] flex-row items-center gap-2 border-b-[3px] border-l-[3px] border-base-black bg-base-white px-2 py-3"
				style={LIST_ITEM_SHADOW_STYLE}>
				<MaterialIcons
					name={icon}
					size={24}
					color={colors.base.black}
				/>
				<Text
					numberOfLines={1}
					className="font-mono text-base leading-5 text-base-black">
					{label}
				</Text>
			</Pressable>
		</Link>
	);
}

export default function ConfigScreen() {
	const { logout } = useAuth();
	const { t } = useI18n();
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [logoutError, setLogoutError] = useState("");

	async function handleLogout() {
		setLogoutError("");
		setIsLoggingOut(true);

		try {
			await logout();
			router.replace("/login");
		} catch {
			setLogoutError(t("auth.logoutError"));
			setIsLoggingOut(false);
		}
	}

	return (
		<SafeAreaView className="flex-1 bg-base-white">
			<Header />

			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				alwaysBounceVertical
				contentInsetAdjustmentBehavior="automatic">
				<View className="gap-12 pb-8 pt-4">
					<View className="px-4">
						<Text className="font-mono-bold text-4xl leading-[48px] text-base-black">
							{t("config.title")}
						</Text>
					</View>

					<View className="gap-[10px] px-4">
						<SectionHeading title={t("config.system")} />
						<View className="w-[267px] gap-4 pb-1 pr-1">
							{SYSTEM_ITEMS.map((item) => (
								<ConfigListItem
									key={item.labelKey}
									{...item}
									label={t(item.labelKey)}
								/>
							))}
						</View>
					</View>

					<View className="gap-3 px-4 pb-4">
						<Pressable
							accessibilityRole="button"
							accessibilityLabel={t("auth.logout")}
							disabled={isLoggingOut}
							onPress={handleLogout}
							className="w-[267px] min-w-[160px] flex-row items-center gap-2 border-b-[3px] border-l-[3px] border-base-black px-2 py-3"
							style={[
								LIST_ITEM_SHADOW_STYLE,
								{
									backgroundColor: colors.feedback.danger.v1,
									opacity: isLoggingOut ? 0.65 : 1,
								},
							]}>
							<MaterialIcons
								name="logout"
								size={24}
								color={colors.base.white}
							/>
							<Text
								numberOfLines={1}
								className="font-mono-bold text-base leading-5 text-base-white">
								{isLoggingOut ? t("auth.loggingOut") : t("auth.logout")}
							</Text>
						</Pressable>

						{logoutError ? (
							<Text className="font-mono text-xs leading-[15px] text-feedback-danger-v1">
								{logoutError}
							</Text>
						) : null}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
