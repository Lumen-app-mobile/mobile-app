import type {
	CreateTagRequestDto,
	TagDto,
	UpdateTagRequestDto,
} from "@/dtos/tag/tag.dtos";
import { authenticatedFetch, handleApiResponse } from "@/services/api";

export async function listarTags(userId?: number): Promise<TagDto[]> {
	const path =
		userId != null ? `api/tags?user_id=${userId}` : "api/tags";
	const response = await authenticatedFetch(path);

	return handleApiResponse<TagDto[]>(response);
}

export async function obtenerTag(id: number): Promise<TagDto> {
	const response = await authenticatedFetch(`api/tags/${id}`);

	return handleApiResponse<TagDto>(response);
}

export async function crearTag(data: CreateTagRequestDto): Promise<TagDto> {
	const response = await authenticatedFetch("api/tags", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});

	return handleApiResponse<TagDto>(response);
}

export async function actualizarTag(
	id: number,
	data: UpdateTagRequestDto,
): Promise<TagDto> {
	const response = await authenticatedFetch(`api/tags/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});

	return handleApiResponse<TagDto>(response);
}

export async function eliminarTag(id: number): Promise<void> {
	const response = await authenticatedFetch(`api/tags/${id}`, {
		method: "DELETE",
	});

	return handleApiResponse<void>(response);
}
