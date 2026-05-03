import {
	BASE_PRODUCT_CATEGORIES,
	DEFAULT_PRODUCT_CATEGORY,
	ProductCategory,
	ProductCategoryOption,
	isBaseProductCategory,
} from "@/domain/category/category.types";

let categoriesStore: ProductCategoryOption[] = BASE_PRODUCT_CATEGORIES.map(
	(category) => ({ ...category }),
);

function cloneCategory(category: ProductCategoryOption): ProductCategoryOption {
	return { ...category };
}

function delay<T>(value: T, ms = 120) {
	return new Promise<T>((resolve) => {
		setTimeout(() => resolve(value), ms);
	});
}

function normalizeCategoryLabel(label: string) {
	return label.trim().replace(/\s+/g, " ");
}

function buildCategoryId(label: string): ProductCategory {
	const normalizedLabel = normalizeCategoryLabel(label)
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

	return `custom-${normalizedLabel || Date.now()}-${Date.now()}`;
}

export async function listarCategorias(): Promise<ProductCategoryOption[]> {
	return delay(categoriesStore.map(cloneCategory));
}

export async function crearCategoria(input: {
	label: string;
}): Promise<ProductCategoryOption | null> {
	const label = normalizeCategoryLabel(input.label);

	if (!label) return delay(null);

	const category: ProductCategoryOption = {
		id: buildCategoryId(label),
		label,
		icon: "category",
		isBase: false,
	};

	categoriesStore = [...categoriesStore, category];

	return delay(cloneCategory(category));
}

export async function editarCategoria(
	categoryId: ProductCategory,
	input: { label: string },
): Promise<ProductCategoryOption | null> {
	if (isBaseProductCategory(categoryId)) return delay(null);

	const label = normalizeCategoryLabel(input.label);

	if (!label) return delay(null);

	const category = categoriesStore.find((item) => item.id === categoryId);

	if (!category || category.isBase) return delay(null);

	const updatedCategory = { ...category, label };
	categoriesStore = categoriesStore.map((item) =>
		item.id === categoryId ? updatedCategory : item,
	);

	return delay(cloneCategory(updatedCategory));
}

export async function eliminarCategoria(
	categoryId: ProductCategory,
): Promise<boolean> {
	if (categoryId === DEFAULT_PRODUCT_CATEGORY || isBaseProductCategory(categoryId)) {
		return delay(false);
	}

	const previousLength = categoriesStore.length;
	categoriesStore = categoriesStore.filter((category) => category.id !== categoryId);

	return delay(categoriesStore.length !== previousLength);
}
