import type { CategoryDto } from "@/dtos/category/category.dtos";
import type { InvoiceDto } from "@/dtos/invoice/invoice.dtos";
import type { TagDto } from "@/dtos/tag/tag.dtos";

export interface TransactionProductDto {
	id: number;
	transaction_id: number;
	name: string;
	price: number;
	quantity: number;
	shop_name: string;
	created_at: string;
}

export interface TransactionDto {
	id: number;
	code: string | null;
	type: "income" | "expense";
	amount: number;
	currency: string;
	description: string;
	company: string;
	move_date: string;
	category_id: number;
	category: CategoryDto;
	user_id: number;
	tags: TagDto[];
	invoices: InvoiceDto[];
	products: TransactionProductDto[];
	is_ocr_processed: boolean;
	created_at: string;
	updated_at: string;
}

export interface CreateTransactionRequestDto {
	type: "income" | "expense";
	amount: number;
	currency: string;
	category_id: number;
	move_date: string;
	description?: string;
	company?: string;
	code?: string | null;
	tag_ids?: number[];
	process_ocr?: boolean;
}

export interface UpdateTransactionRequestDto {
	type?: "income" | "expense";
	amount?: number;
	currency?: string;
	description?: string;
	company?: string;
	move_date?: string;
	category_id?: number;
	code?: string | null;
}
