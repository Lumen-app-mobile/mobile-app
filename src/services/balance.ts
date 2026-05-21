import type { BalanceResponseDto } from "@/dtos/balance/balance.dtos";
import { authenticatedFetch, handleApiResponse } from "@/services/api";

export async function obtenerBalance(
	currency = "EUR",
): Promise<BalanceResponseDto> {
	const response = await authenticatedFetch(
		`api/balance?currency=${currency}`,
	);

	return handleApiResponse<BalanceResponseDto>(response);
}
