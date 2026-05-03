import { type ComponentProps } from "react";
import { MaterialIcons } from "@expo/vector-icons";

export type BaseProductCategory = "obligacion" | "ocio" | "ahorro";
export type ProductCategory = BaseProductCategory | (string & {});
export type CategoryIcon = ComponentProps<typeof MaterialIcons>["name"];

export interface ProductCategoryOption {
	id: ProductCategory;
	label: string;
	icon: CategoryIcon;
	isBase: boolean;
}

export const BASE_PRODUCT_CATEGORIES: ProductCategoryOption[] = [
	{
		id: "obligacion",
		label: "Obligación",
		icon: "payment",
		isBase: true,
	},
	{
		id: "ocio",
		label: "Ocio",
		icon: "sports-esports",
		isBase: true,
	},
	{
		id: "ahorro",
		label: "Ahorros",
		icon: "savings",
		isBase: true,
	},
];

export const DEFAULT_PRODUCT_CATEGORY: BaseProductCategory = "obligacion";

export function isBaseProductCategory(
	categoryId: ProductCategory,
): categoryId is BaseProductCategory {
	return BASE_PRODUCT_CATEGORIES.some((category) => category.id === categoryId);
}

export function getCategoryLabel(
	categories: ProductCategoryOption[],
	categoryId: ProductCategory,
) {
	return (
		categories.find((category) => category.id === categoryId)?.label ?? categoryId
	);
}
