import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";

import colors from "@/constants/colors";

interface BrutalButtonProps {
	label: string;
	icon?: keyof typeof MaterialIcons.glyphMap;
	variant?: "primary" | "secondary" | "danger";
	fullWidth?: boolean;
	disabled?: boolean;
	onPress: () => void;
}

export default function BrutalButton({
	label,
	icon,
	variant = "primary",
	fullWidth,
	disabled,
	onPress,
}: BrutalButtonProps) {
	const backgroundColor =
		variant === "primary"
			? colors.primary.v1
			: variant === "danger"
				? colors.feedback.danger.v1
				: colors.base.white;
	const textColor =
		variant === "secondary" ? colors.base.black : colors.base.white;

	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel={label}
			disabled={disabled}
			onPress={onPress}
			style={{
				alignItems: "center",
				backgroundColor,
				borderColor: colors.base.black,
				borderWidth: 3,
				flexDirection: "row",
				gap: 8,
				opacity: disabled ? 0.5 : 1,
				paddingHorizontal: 19,
				paddingVertical: 11,
				shadowColor: colors.base.black,
				shadowOffset: { width: 4, height: 4 },
				shadowOpacity: 1,
				shadowRadius: 1,
				width: fullWidth ? "100%" : undefined,
				elevation: 5,
			}}
		>
			{icon ? <MaterialIcons name={icon} size={20} color={textColor} /> : null}
			<Text
				numberOfLines={1}
				style={{
					color: textColor,
					fontFamily: "RedHatMono_700Bold",
					fontSize: 12,
					lineHeight: 16,
					textAlign: "center",
				}}
			>
				{label}
			</Text>
		</Pressable>
	);
}