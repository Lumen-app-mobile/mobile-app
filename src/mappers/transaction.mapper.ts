import type {
	Factura,
	FacturaField,
	FacturaProcessStatus,
} from "@/domain/factura/factura.types";
import type { TransactionDto } from "@/dtos/transaction/transaction.dtos";
import type { ProductCategory, Producto } from "@/domain/product/product.types";

export function centsToAmount(cents: number): number {
	return cents / 100;
}

export function amountToCents(amount: number): number {
	return Math.round(amount * 100);
}

function mapProcessStatus(dto: TransactionDto): FacturaProcessStatus {
	if (dto.is_ocr_processed) return "pending_review";
	return "not_complete";
}

function mapFields(dto: TransactionDto): FacturaField[] {
	const market = dto.company || "";
	if (!dto.company) {
		console.warn(`[Mapper] Transaction #${dto.id}: company is null/empty`);
	}

	const totalValue = dto.amount > 0 ? String(dto.amount) : "0";
	if (dto.amount <= 0) {
		console.warn(`[Mapper] Transaction #${dto.id}: amount is ${dto.amount}`);
	}

	return [
		{
			key: "market",
			label: "Comercio",
			value: market || "Sin especificar",
			confidence: dto.is_ocr_processed ? 0.9 : 1,
			required: false,
			status: dto.company ? "complete" : "missing",
		},
		{
			key: "total",
			label: "Total",
			value: totalValue,
			confidence: 1,
			required: true,
			status: dto.amount > 0 ? "complete" : "missing",
		},
	];
}

function mapProducts(dto: TransactionDto): Factura["products"] {
	return dto.products.map((p) => {
		const name = p.name || "Producto sin nombre";
		if (!p.name) {
			console.warn(`[Mapper] Product #${p.id}: name is null/empty`);
		}

		const market = p.shop_name || "";
		if (!p.shop_name) {
			console.warn(`[Mapper] Product #${p.id}: shop_name is null/empty`);
		}

		return {
			id: String(p.id),
			name,
			category: "obligacion" as ProductCategory,
			amount: centsToAmount(p.price),
			market,
			date: dto.move_date?.slice(0, 10) ?? "",
			source: dto.is_ocr_processed ? ("ocr" as const) : ("manual" as const),
		};
	});
}

export function transactionDtoToFactura(dto: TransactionDto): Factura {
	if (!dto.company && !dto.description) {
		console.warn(`[Mapper] Transaction #${dto.id}: both company and description are empty`);
	}

	return {
		id: String(dto.id),
		displayName: dto.company || dto.description || `#${dto.id}`,
		status: mapProcessStatus(dto),
		createdAt: dto.created_at,
		fields: mapFields(dto),
		products: mapProducts(dto),
		imageUrl: dto.invoices?.[0]?.file_url,
		errorCode: undefined,
		errorMessage: undefined,
	};
}

export function transactionDtoListToFacturaList(
	dtos: TransactionDto[],
): Factura[] {
	return dtos.map(transactionDtoToFactura);
}

export function transactionToProductos(dto: TransactionDto): Producto[] {
	return dto.products.map((p) => ({
		id: String(p.id),
		brand: p.shop_name || "",
		name: p.name,
		price: centsToAmount(p.price),
		date: dto.move_date?.slice(0, 10) ?? "",
		category: dto.category.name,
		transactionId: p.transaction_id,
	}));
}

export function transactionListToProductoList(dtos: TransactionDto[]): Producto[] {
	return dtos.flatMap(transactionToProductos);
}
