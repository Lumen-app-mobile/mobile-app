import type {
	CreateTransactionRequestDto,
	TransactionDto,
	UpdateTransactionRequestDto,
} from "@/dtos/transaction/transaction.dtos";
import { authenticatedFetch, handleApiResponse } from "@/services/api";

export async function listarTransacciones(): Promise<TransactionDto[]> {
	const response = await authenticatedFetch("api/transactions");

	return handleApiResponse<TransactionDto[]>(response);
}

export async function obtenerTransaccion(
	id: number,
): Promise<TransactionDto> {
	const response = await authenticatedFetch(`api/transactions/${id}`);

	return handleApiResponse<TransactionDto>(response);
}

export async function crearTransaccion(
	data: CreateTransactionRequestDto,
): Promise<TransactionDto> {
	const response = await authenticatedFetch("api/transactions", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});

	return handleApiResponse<TransactionDto>(response);
}

export async function crearTransaccionConImagen(
	data: CreateTransactionRequestDto,
	imageUri: string,
	imageType: string,
	imageName: string,
): Promise<TransactionDto> {
	const formData = new FormData();

	formData.append("data", JSON.stringify(data));
	formData.append("image", {
		uri: imageUri,
		type: imageType,
		name: imageName,
	} as unknown as Blob);

	const response = await authenticatedFetch("api/transactions", {
		method: "POST",
		body: formData,
	});

	return handleApiResponse<TransactionDto>(response);
}

export async function actualizarTransaccion(
	id: number,
	data: UpdateTransactionRequestDto,
): Promise<TransactionDto> {
	const response = await authenticatedFetch(`api/transactions/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});

	return handleApiResponse<TransactionDto>(response);
}

export async function eliminarTransaccion(id: number): Promise<void> {
	const response = await authenticatedFetch(`api/transactions/${id}`, {
		method: "DELETE",
	});

	return handleApiResponse<void>(response);
}
