import type { ProductCategory } from "@/domain/category/category.types";

export type { ProductCategory } from "@/domain/category/category.types";

export interface Producto {
	id: string;
	brand: string;
	name: string;
	price: number;
	date: string;
	category: ProductCategory;
}
