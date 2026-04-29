import { ProductCategory } from "@/domain/product/product.types";

export type FacturaUploadStatus =
	| "idle"
	| "uploading"
	| "success"
	| "not_complete"
	| "error";

export type FacturaProcessStatus =
	| "pending_review"
	| "validated"
	| "denied"
	| "not_complete"
	| "error";

export type FacturaFieldStatus = "complete" | "missing" | "low_confidence";

export interface FacturaField {
	key: string;
	label: string;
	value: string;
	confidence: number;
	required: boolean;
	status: FacturaFieldStatus;
}

export interface FacturaProduct {
	id: string;
	name: string;
	category: ProductCategory;
	amount: number;
	market: string;
	date: string;
	source: "ocr" | "manual";
}

export interface Factura {
	id: string;
	displayName: string;
	status: FacturaProcessStatus;
	imageUrl?: string;
	createdAt: string;
	fields: FacturaField[];
	products: FacturaProduct[];
	errorCode?: string;
	errorMessage?: string;
}

export interface FacturaNotification {
	id: string;
	facturaId: string;
	title: string;
	detail: string;
	createdAt: string;
	read: boolean;
}

export interface ManualFacturaProductInput {
	name: string;
	category: ProductCategory;
	amount: number;
	market: string;
}
