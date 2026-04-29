import {
	demoFacturaNotifications,
	demoFacturas,
} from "@/assets/data/facturaData";
import {
	ManualFacturaProductInput,
	Factura,
	FacturaNotification,
	FacturaUploadStatus,
} from "@/domain/factura/factura.types";

let facturasStore: Factura[] = [...demoFacturas];
let notificacionesStore: FacturaNotification[] = [...demoFacturaNotifications];

function cloneFactura(factura: Factura): Factura {
	return {
		...factura,
		fields: factura.fields.map((field) => ({ ...field })),
		products: factura.products.map((product) => ({ ...product })),
	};
}

function delay<T>(value: T, ms = 350) {
	return new Promise<T>((resolve) => {
		setTimeout(() => resolve(value), ms);
	});
}

export async function subirFacturaMock(): Promise<{
	facturaId?: string;
	status: Exclude<FacturaUploadStatus, "idle" | "uploading">;
	displayName?: string;
	errorMessage?: string;
}> {
	const statuses: ("success" | "not_complete" | "error")[] = [
		"success",
		"not_complete",
		"error",
	];
	const status = statuses[Math.floor(Math.random() * statuses.length)];

	if (status === "error") {
		return delay({
			status,
			errorMessage: "No se pudo procesar la factura. Inténtalo de nuevo.",
		});
	}

	const factura: Factura = {
		id: `factura-upload-${Date.now()}`,
		displayName:
			status === "success" ? "Factura subida correctamente" : "Factura incompleta",
		status: status === "success" ? "pending_review" : "not_complete",
		createdAt: new Date().toISOString(),
		fields: [
			{
				key: "market",
				label: "Mercado",
				value: status === "success" ? "Mercado detectado" : "",
				confidence: status === "success" ? 0.9 : 0.2,
				required: true,
				status: status === "success" ? "complete" : "missing",
			},
			{
				key: "total",
				label: "Total",
				value: status === "success" ? "22.40" : "",
				confidence: status === "success" ? 0.91 : 0.18,
				required: true,
				status: status === "success" ? "complete" : "missing",
			},
		],
		products:
			status === "success"
				? [
						{
							id: `factura-product-${Date.now()}`,
							name: "Producto detectado",
							category: "obligacion",
							amount: 22.4,
							market: "Mercado detectado",
							date: new Date().toISOString().slice(0, 10),
							source: "ocr",
						},
					]
				: [],
		errorCode: status === "not_complete" ? "OCR_INCOMPLETE" : undefined,
		errorMessage:
			status === "not_complete"
				? "Algunos campos no se han podido detectar."
				: undefined,
	};

	facturasStore = [factura, ...facturasStore];

	if (status === "success") {
		notificacionesStore = [
			{
				id: `notification-${factura.id}`,
				facturaId: factura.id,
				title: "Factura lista para revisar",
				detail: factura.displayName,
				createdAt: new Date().toISOString(),
				read: false,
			},
			...notificacionesStore,
		];
	}

	return delay({
		facturaId: factura.id,
		status,
		displayName: factura.displayName,
	});
}

export async function listarFacturas(limit = 5): Promise<Factura[]> {
	return delay(facturasStore.slice(0, limit).map(cloneFactura), 180);
}

export async function obtenerFactura(facturaId: string): Promise<Factura | null> {
	const factura = facturasStore.find((item) => item.id === facturaId);

	return delay(factura ? cloneFactura(factura) : null, 180);
}

export async function agregarProductoManualAFactura(
	facturaId: string,
	input: ManualFacturaProductInput,
): Promise<Factura | null> {
	const facturaIndex = facturasStore.findIndex((item) => item.id === facturaId);

	if (facturaIndex === -1) return delay(null, 180);

	const factura = facturasStore[facturaIndex];
	const product = {
		id: `manual-product-${Date.now()}`,
		...input,
		date: new Date().toISOString().slice(0, 10),
		source: "manual" as const,
	};
	const updatedFactura: Factura = {
		...factura,
		status: "pending_review",
		products: [product, ...factura.products],
		fields: factura.fields.map((field) =>
			field.status === "missing"
				? {
						...field,
						value: field.key === "product" ? input.name : field.value,
						confidence: 1,
						status: "complete",
					}
				: field,
		),
		errorCode: undefined,
		errorMessage: undefined,
	};

	facturasStore = facturasStore.map((item, index) =>
		index === facturaIndex ? updatedFactura : item,
	);

	return delay(cloneFactura(updatedFactura), 220);
}

export async function validarFactura(facturaId: string): Promise<Factura | null> {
	return updateFacturaStatus(facturaId, "validated");
}

export async function denegarFactura(facturaId: string): Promise<Factura | null> {
	return updateFacturaStatus(facturaId, "denied");
}

async function updateFacturaStatus(
	facturaId: string,
	status: Factura["status"],
): Promise<Factura | null> {
	const factura = facturasStore.find((item) => item.id === facturaId);

	if (!factura) return delay(null, 180);

	const updatedFactura = { ...factura, status };
	facturasStore = facturasStore.map((item) =>
		item.id === facturaId ? updatedFactura : item,
	);

	return delay(cloneFactura(updatedFactura), 220);
}

export async function listarNotificacionesFacturas(): Promise<FacturaNotification[]> {
	return delay(
		notificacionesStore.map((notification) => ({ ...notification })).slice(0, 5),
		180,
	);
}
