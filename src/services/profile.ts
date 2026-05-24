import type { UpdateProfileRequestDto } from "@/dtos/auth/auth.dtos";
import { authenticatedFetch, handleApiResponse } from "@/services/api";

export async function actualizarNombre(name: string): Promise<void> {
	const body: UpdateProfileRequestDto = { name };
	const response = await authenticatedFetch("api/auth/profile", {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});

	return handleApiResponse<void>(response);
}
