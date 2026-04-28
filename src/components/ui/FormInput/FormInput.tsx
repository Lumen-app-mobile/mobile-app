import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

import colors from "@/constants/colors";

type InputSize = "sm" | "md" | "lg";
type InputState = "default" | "disabled" | "withIcon";

interface InputProps extends Omit<TextInputProps, "editable"> {
	label?: string;
	state?: InputState;
	size?: InputSize;
	icon?: React.ReactNode;
}

// Cada tamaño controla únicamente la geometría del campo.
const sizeStyles = {
	sm: {
		text: "text-sm",
		paddingX: 12,
		paddingY: 8,
		borderWidth: 3,
		iconSize: 16,
		fontSize: 14,
		lineHeight: 14,
	},
	md: {
		text: "text-base",
		paddingX: 12,
		paddingY: 8,
		borderWidth: 4,
		iconSize: 18,
		fontSize: 16,
		lineHeight: 16,
	},
	lg: {
		text: "text-lg",
		paddingX: 12,
		paddingY: 8,
		borderWidth: 4,
		iconSize: 24,
		fontSize: 18,
		lineHeight: 18,
	},
} as const;

// Cada estado controla apariencia y comportamiento, sin tocar layout.
const stateStyles = {
	default: {
		borderColor: "border-base-black",
		textColor: "text-base-black",
		labelColor: "text-base-black",
		editable: true,
		showIcon: false,
	},
	disabled: {
		borderColor: "border-secondary-v3",
		textColor: "text-secondary-v3",
		labelColor: "text-secondary-v3",
		editable: false,
		showIcon: false,
	},
	withIcon: {
		borderColor: "border-base-black",
		textColor: "text-base-black",
		labelColor: "text-base-black",
		editable: true,
		showIcon: true,
	},
} as const;

export default function TextField({
	label,
	state = "default",
	size = "sm",
	icon,
	style,
	placeholder = "placeholder",
	...textInputProps
}: InputProps) {
	// La UI final sale de combinar un tamaño y un estado.
	const currentSize = sizeStyles[size];
	const currentState = stateStyles[state];
	const showIcon = currentState.showIcon && !!icon;

	return (
		<View
			className="items-start"
			style={{ gap: 5 }}>
			{label ? (
				<Text
					className={`font-mono ${currentSize.text} ${currentState.labelColor}`}>
					{label}
				</Text>
			) : null}

			<View
				className={`w-full flex-row items-center ${currentState.borderColor}`}
				style={{
					borderWidth: currentSize.borderWidth,
					gap: 10,
					paddingHorizontal: currentSize.paddingX,
					paddingVertical: currentSize.paddingY,
				}}>
				{/* El icono solo aparece en el estado pensado para inputs con apoyo visual. */}
				{showIcon ? (
					<View
						style={{
							width: currentSize.iconSize,
							height: currentSize.iconSize,
						}}>
						{icon}
					</View>
				) : null}

				{/* Se resetea el padding nativo del TextInput para que el espaciado lo controle el contenedor. */}
				<TextInput
					{...textInputProps}
					editable={currentState.editable}
					placeholder={placeholder}
					placeholderTextColor={colors.secondary.v3}
					className={`flex-1 font-mono ${currentSize.text} ${currentState.textColor}`}
					style={[
						{
							fontSize: currentSize.fontSize,
							lineHeight: currentSize.lineHeight,
							margin: 0,
							padding: 0,
							textAlignVertical: "center",
						},
						style,
					]}
				/>
			</View>
		</View>
	);
}
