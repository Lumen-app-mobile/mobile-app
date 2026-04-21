import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ── Constantes de diseño (de dataFigma.json) ────────────────────────────────

const PRIMARY_V1 = "#4ECDC4";
const WHITE = "#FFFFFF";
const BLACK = "#000000";
const BORDER_BRUTAL = 3;
const FONT_SIZE_XS = 12; // global.fontSize.xs

// ── Datos de tabs ────────────────────────────────────────────────────────────

type TabKey = "index" | "productos" | "scan" | "config";

const TABS: {
	key: TabKey;
	label: string;
	icon: keyof typeof MaterialIcons.glyphMap;
}[] = [
	{ key: "index", label: "HOME", icon: "home" },
	{ key: "productos", label: "PRODUCTOS", icon: "list-alt" },
	{ key: "scan", label: "SCAN", icon: "qr-code" },
	{ key: "config", label: "CONFIG", icon: "settings" },
];

// ── Props ────────────────────────────────────────────────────────────────────

interface BottomNavBarProps {
	state: { index: number; routes: { name: string }[] };
	navigation: { navigate: (name: string) => void };
}

// ── Componente ───────────────────────────────────────────────────────────────
//
// Fiel al node 28:367 de Figma:
//   Wrapper:        bg blanco, border 3px negro, shadow (4,4,1,0) negro, p-[3px]
//   Tab activo:     bg #4ECDC4  · sin borde interno · icono+texto blancos
//   Tab inactivo:   bg blanco   · border 3px #4ECDC4 · icono+texto #4ECDC4
//   Tipografía:     RedHatMono Bold · 12px (xs) · uppercase · lineHeight 15
//   Gap icono-text: 4px (global.spacing.s1)
//   Padding tab:    12px (global.spacing.s3 = spacing.tailwind.4)

export default function BottomNavBar({ state, navigation }: BottomNavBarProps) {
	const insets = useSafeAreaInsets();
	const activeKey = state.routes[state.index]?.name as TabKey;

	return (
		<View
			style={{
				backgroundColor: WHITE,
				paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
				paddingHorizontal: 20,
				paddingTop: 4,
			}}>
			{/* Contenedor principal — border brutal negro */}
			<View
				style={{
					flexDirection: "row",
					backgroundColor: WHITE,
					borderWidth: BORDER_BRUTAL,
					borderColor: BLACK,
					padding: 3,
					shadowColor: BLACK,
					shadowOffset: { width: 4, height: 4 },
					shadowOpacity: 1,
					shadowRadius: 1,
					elevation: 5,
				}}>
				{TABS.map((tab) => {
					const isActive = activeKey === tab.key;

					return (
						<Pressable
							key={tab.key}
							onPress={() => navigation.navigate(tab.key)}
							style={{
								flex: 1,
								alignItems: "center",
								justifyContent: "center",
								paddingVertical: 12, // s3
								gap: 4, // s1
								backgroundColor: isActive ? PRIMARY_V1 : WHITE,
								borderWidth: isActive ? 0 : BORDER_BRUTAL,
								borderColor: PRIMARY_V1,
							}}>
							<MaterialIcons
								name={tab.icon}
								size={24}
								color={isActive ? WHITE : PRIMARY_V1}
							/>
							<Text
								style={{
									fontFamily: "RedHatMono_700Bold",
									fontSize: FONT_SIZE_XS,
									lineHeight: 15,
									textTransform: "uppercase",
									color: isActive ? WHITE : PRIMARY_V1,
								}}>
								{tab.label}
							</Text>
						</Pressable>
					);
				})}
			</View>
		</View>
	);
}
