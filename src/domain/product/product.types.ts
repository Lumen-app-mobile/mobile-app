export type ProductCategory = "obligacion" | "ahorro" | "ocio";

export interface Producto {
	id: string;
	brand: string;
	name: string;
	price: number;
	date: string;
	category: ProductCategory;
}
