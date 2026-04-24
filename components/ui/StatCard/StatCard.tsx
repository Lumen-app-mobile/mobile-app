import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import colors from "@/constants/colors";

interface StatCardProps {
	icon: keyof typeof MaterialIcons.glyphMap;
	reference: string;
	label: string;
	value: string;
}

const BORDER_BRUTAL = 3;

export default function StatCard({
	icon,
	reference,
	label,
	value,
}: StatCardProps) {
	return (
		<View
			style={{
				width: "100%",
				backgroundColor: colors.base.white,
				borderWidth: BORDER_BRUTAL,
				borderColor: colors.base.black,
				paddingHorizontal: 30,
				paddingVertical: 17,
				gap: 16,
				shadowColor: "#111111",
				shadowOffset: { width: 4, height: 4 },
				shadowOpacity: 1,
				shadowRadius: 0,
				elevation: 5,
			}}>
			<View
				style={{
					width: "100%",
					backgroundColor: colors.primary.v1,
					padding: 4,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
				}}>
				<View
					style={{
						backgroundColor: colors.base.white,
						borderWidth: 2,
						borderColor: colors.base.black,
						padding: 10,
					}}>
					<MaterialIcons
						name={icon}
						size={24}
						color={colors.base.black}
					/>
				</View>

				<Text
					numberOfLines={1}
					style={{
						fontFamily: "RedHatMono_500Medium",
						fontSize: 12,
						lineHeight: 16,
						color: colors.base.white,
					}}>
					{reference}
				</Text>
			</View>

			<Text
				numberOfLines={1}
				style={{
					fontFamily: "RedHatMono_500Medium",
					fontSize: 12,
					lineHeight: 16,
					color: colors.base.black,
				}}>
				{label}
			</Text>

			<Text
				numberOfLines={1}
				adjustsFontSizeToFit
				style={{
					fontFamily: "RedHatMono_700Bold",
					fontSize: 48,
					lineHeight: 64,
					color: colors.base.black,
				}}>
				{value}
			</Text>
		</View>
	);
}
