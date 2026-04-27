import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Link, type Href } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TitleDecorator from "@/assets/images/Vector(1).svg";
import Header from "@/components/layout/Header/Header";
import colors from "@/constants/colors";

type ConfigItem = {
	label: string;
	icon: keyof typeof MaterialIcons.glyphMap;
	href: Href;
};

type PermissionItem = {
	key: "camera" | "storage" | "location";
	label: string;
};

const SYSTEM_ITEMS: ConfigItem[] = [
	{
		label: "Perfil",
		icon: "person-outline",
		href: "/config/perfil",
	},
	{
		label: "Preferencias",
		icon: "tune",
		href: "/config/preferencias",
	},
	{
		label: "Notificaciones",
		icon: "notifications-none",
		href: "/config/notificaciones",
	},
	{
		label: "Categorias",
		icon: "category",
		href: "/config/categorias",
	},
	{
		label: "Datos",
		icon: "dataset",
		href: "/config/datos",
	},
	{
		label: "Información",
		icon: "info-outline",
		href: "/config/informacion",
	},
];

const PERMISSION_ITEMS: PermissionItem[] = [
	{ key: "camera", label: "Acceso a Cámara" },
	{ key: "storage", label: "Almacenamiento" },
	{ key: "location", label: "Ubicación" },
];

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

function ConfigListItem({ label, icon, href }: ConfigItem) {
	return (
		<Link
			href={href}
			asChild>
			<Pressable
				accessibilityRole="link"
				accessibilityLabel={label}
				className="w-full min-w-[160px] flex-row items-center gap-2 overflow-hidden border-b-[3px] border-l-[3px] border-base-black bg-base-white px-2 py-3 shadow-[4px_4px_1px_black]">
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

function PermissionToggle({
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
			className="w-full flex-row items-center justify-between">
			<Text className="font-mono text-xs leading-[15px] text-base-black">
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

export default function ConfigScreen() {
	const [permissions, setPermissions] = useState<Record<PermissionItem["key"], boolean>>({
		camera: false,
		location: false,
		storage: false,
	});

	function handleNotificationsPress() {}

	function togglePermission(key: PermissionItem["key"]) {
		setPermissions((currentPermissions) => ({
			...currentPermissions,
			[key]: !currentPermissions[key],
		}));
	}

	return (
		<SafeAreaView className="flex-1 bg-base-white">
			<Header onNotificationsPress={handleNotificationsPress} />

			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				alwaysBounceVertical
				contentInsetAdjustmentBehavior="automatic">
				<View className="gap-12 pb-8 pt-4">
					<View className="px-4">
						<Text className="font-mono-bold text-4xl leading-[48px] text-base-black">
							configuración
						</Text>
					</View>

					<View className="gap-[10px] px-4">
						<SectionHeading title="Sistema" />
						<View className="w-[263px] gap-4">
							{SYSTEM_ITEMS.map((item) => (
								<ConfigListItem
									key={item.label}
									{...item}
								/>
							))}
						</View>
					</View>

					<View className="gap-4 px-4">
						<SectionHeading title="Permisos de la app" />
						<View className="w-[264px] gap-[18px] px-4">
							{PERMISSION_ITEMS.map((permission) => (
								<PermissionToggle
									key={permission.key}
									label={permission.label}
									enabled={permissions[permission.key]}
									onPress={() => togglePermission(permission.key)}
								/>
							))}
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
