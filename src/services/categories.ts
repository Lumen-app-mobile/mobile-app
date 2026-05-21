import type { CategoryIcon, ProductCategoryOption } from "@/domain/category/category.types";
import {
	BASE_PRODUCT_CATEGORIES,
	isBaseProductCategory,
} from "@/domain/category/category.types";
import type { CategoryDto } from "@/dtos/category/category.dtos";
import { authenticatedFetch, handleApiResponse } from "@/services/api";

function mapTypeToIcon(type: "income" | "expense"): CategoryIcon {
	return type === "income" ? "trending-up" : "trending-down";
}

function toUiCategory(dto: CategoryDto): ProductCategoryOption {
	return {
		id: String(dto.id),
		label: dto.name,
		icon: mapTypeToIcon(dto.type),
		isBase: false,
	};
}

export async function listarCategoriasRaw(): Promise<CategoryDto[]> {
	try {
		const response = await authenticatedFetch("api/categories");
		return handleApiResponse<CategoryDto[]>(response);
	} catch {
		return [];
	}
}

export async function listarCategorias(
	type?: "income" | "expense",
): Promise<ProductCategoryOption[]> {
	try {
		const path = type
			? `api/categories?type=${type}`
			: "api/categories";
		const response = await authenticatedFetch(path);

		if (!response.ok) {
			return [...BASE_PRODUCT_CATEGORIES];
		}

		const data: CategoryDto[] = await response.json();

		return [
			...BASE_PRODUCT_CATEGORIES,
			...data.filter((dto) => !isBaseProductCategory(dto.name)).map(toUiCategory),
		];
	} catch {
		return [...BASE_PRODUCT_CATEGORIES];
	}
}

export async function crearCategoria(input: {
	label: string;
	type: "income" | "expense";
}): Promise<ProductCategoryOption | null> {
	try {
		const response = await authenticatedFetch("api/categories", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name: input.label, type: input.type }),
		});

		if (!response.ok) return null;

		const data: CategoryDto = await response.json();

		return toUiCategory(data);
	} catch {
		return null;
	}
}

export async function editarCategoria(
	categoryId: string,
	input: { label: string },
): Promise<ProductCategoryOption | null> {
	if (isBaseProductCategory(categoryId as any)) return null;

	try {
		const response = await authenticatedFetch(
			`api/categories/${categoryId}`,
			{
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: input.label }),
			},
		);

		if (!response.ok) return null;

		const data: CategoryDto = await response.json();

		return toUiCategory(data);
	} catch {
		return null;
	}
}

export async function eliminarCategoria(
	categoryId: string,
): Promise<boolean> {
	if (isBaseProductCategory(categoryId as any)) return false;

	try {
		const response = await authenticatedFetch(
			`api/categories/${categoryId}`,
			{ method: "DELETE" },
		);

		return response.status === 204;
	} catch {
		return false;
	}
}
