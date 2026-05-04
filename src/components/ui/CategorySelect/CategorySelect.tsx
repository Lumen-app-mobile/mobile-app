import { Pressable, Text, View } from "react-native";

import colors from "@/constants/colors";
import { ProductCategory } from "@/domain/product/product.types";

export { ProductCategory };

const CATEGORY_OPTIONS: { label: string; value: ProductCategory }[] = [
	{ label: "Obligación", value: "obligacion" },
	{ label: "Ahorro", value: "ahorro" },
	{ label: "Ocio", value: "ocio" },
];

interface CategorySelectProps {
	value: ProductCategory;
	onChange: (value: ProductCategory) => void;
}

export default function CategorySelect({ value, onChange }: CategorySelectProps) {
	return (
		<View className="gap-[5px]">
			<Text className="font-mono text-base leading-5 text-base-black">
				Categoria
			</Text>
			<View className="flex-row gap-2">
				{CATEGORY_OPTIONS.map((option) => {
					const active = option.value === value;

					return (
						<Pressable
							key={option.value}
							accessibilityRole="button"
							accessibilityState={{ selected: active }}
							onPress={() => onChange(option.value)}
							className={`min-h-[42px] flex-1 items-center justify-center border-[4px] border-base-black px-2 py-2 ${
								active ? "bg-primary-v1" : "bg-base-white"
							}`}
						>
							<Text
								numberOfLines={1}
								adjustsFontSizeToFit
								className={`font-mono text-xs leading-[15px] ${
									active ? "text-base-white" : "text-secondary-v3"
								}`}
							>
								{option.label}
							</Text>
						</Pressable>
					);
				})}
			</View>
		</View>
	);
}