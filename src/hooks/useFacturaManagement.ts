import { useEffect, useState } from "react";
import type { Factura, FacturaNotification, FacturaUploadStatus } from "@/domain/factura/factura.types";
import type { CreateTransactionRequestDto } from "@/dtos/transaction/transaction.dtos";
import {
	listarTransacciones,
	crearTransaccionConImagen,
} from "@/services/transactions";
import {
	listarFacturas as listarFacturasMock,
	subirFacturaMock,
	agregarProductoManualAFactura,
} from "@/services/facturas";
import type { ProductCategory } from "@/components/ui/CategorySelect/CategorySelect";
import { transactionDtoToFactura, transactionDtoListToFacturaList } from "@/mappers/transaction.mapper";

function useRealApi(): boolean {
	const url = process.env.EXPO_PUBLIC_API_BASE_URL;
	console.log(`[FacturaManagement] EXPO_PUBLIC_API_BASE_URL = "${url}" → realApi = ${!!url}`);
	return !!url;
}

function buildCreatePayload(): CreateTransactionRequestDto {
	return {
		type: "expense",
		amount: 0,
		currency: "EUR",
		category_id: 1,
		move_date: new Date().toISOString(),
		process_ocr: true,
	};
}

export function useFacturaManagement() {
	const [facturas, setFacturas] = useState<Factura[]>([]);
	const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
	const [uploadStatus, setUploadStatus] = useState<FacturaUploadStatus>("idle");
	const [ultimaFacturaId, setLastFacturaId] = useState<string | null>(null);
	const [statusError, setStatusError] = useState<string | undefined>();
	const [isPreviewVisible, setIsPreviewVisible] = useState(false);
	const [notifications, setNotifications] = useState<FacturaNotification[]>([]);
	const realApi = useRealApi();

	async function refreshFacturas(): Promise<Factura[]> {
		try {
			const transactions = await listarTransacciones();
			const mapped = transactionDtoListToFacturaList(transactions);
			setFacturas(mapped);
			return mapped;
		} catch (err) {
			console.warn("[FacturaManagement] listarTransacciones failed, using cached data:", err);
			return [];
		}
	}

	useEffect(() => {
		if (realApi) {
			refreshFacturas().then((mapped) => {
				setSelectedFactura((current) => current ?? mapped[0] ?? null);
			});
		} else {
			listarFacturasMock(5).then((nextFacturas) => {
				setFacturas(nextFacturas);
				setSelectedFactura(
					(current) => current ?? nextFacturas[0] ?? null,
				);
			});
		}
	}, [realApi]);

	async function handleUploadFactura(imageUri?: string) {
		setUploadStatus("uploading");
		setStatusError(undefined);

		if (realApi && imageUri) {
			try {
				const transaction = await crearTransaccionConImagen(
					buildCreatePayload(),
					imageUri,
					"image/jpeg",
					`ticket-${Date.now()}.jpg`,
				);

				setUploadStatus("success");
				setLastFacturaId(String(transaction.id));
				setIsPreviewVisible(false);

				const notification: FacturaNotification = {
					id: `notification-${transaction.id}`,
					facturaId: String(transaction.id),
					title: "Factura lista para revisar",
					detail: transaction.company || `#${transaction.id}`,
					createdAt: new Date().toISOString(),
					read: false,
				};
				setNotifications((prev) => [notification, ...prev]);

				const mappedFactura = transactionDtoToFactura(transaction);
				setSelectedFactura(mappedFactura);
				setFacturas((prev) => {
					const idx = prev.findIndex((f) => f.id === String(transaction.id));
					if (idx >= 0) {
						const next = [...prev];
						next[idx] = mappedFactura;
						return next;
					}
					return [mappedFactura, ...prev];
				});

				refreshFacturas().catch((err) => {
					console.warn("[FacturaManagement] refresh after upload failed:", err);
				});
			} catch (err: unknown) {
				const message =
					err instanceof Error ? err.message : "Error al subir la factura";
				setUploadStatus("error");
				setStatusError(message);
				setIsPreviewVisible(false);
			}
		} else {
			const result = await subirFacturaMock();
			setUploadStatus(result.status);
			setLastFacturaId(result.facturaId ?? null);
			setStatusError(result.errorMessage);
			setIsPreviewVisible(false);

			const nextFacturas = await listarFacturasMock(5);
			setFacturas(nextFacturas);
			if (result.facturaId) {
				const uploadedFactura = nextFacturas.find(
					(factura) => factura.id === result.facturaId,
				);
				setSelectedFactura(uploadedFactura ?? nextFacturas[0] ?? null);
			}
		}
	}

	async function handleManualSubmit(
		currentFactura: Factura | null,
		name: string,
		category: ProductCategory,
		amount: string,
		market: string,
		onSuccess: () => void,
	) {
		const parsedAmount = Number(amount.trim().replace(",", "."));

		if (
			!currentFactura ||
			!name.trim() ||
			!market.trim() ||
			!Number.isFinite(parsedAmount)
		) {
			setUploadStatus("error");
			setStatusError("Selecciona una factura y completa todos los campos.");
			return;
		}

		const updatedFactura = await agregarProductoManualAFactura(
			currentFactura.id,
			{
				name: name.trim(),
				category,
				amount: parsedAmount,
				market: market.trim(),
			},
		);

		if (!updatedFactura) {
			setUploadStatus("error");
			setStatusError("No se pudo vincular el producto a la factura.");
			return;
		}

		setSelectedFactura(updatedFactura);
		setLastFacturaId(updatedFactura.id);
		setUploadStatus("success");
		setStatusError(undefined);
		onSuccess();
		setFacturas(realApi ? facturas : await listarFacturasMock(5));
	}

	function handleSelectFactura(factura: Factura) {
		setSelectedFactura(factura);
	}

	function resetForm() {
		setUploadStatus("idle");
		setStatusError(undefined);
	}

	const completedUploadStatus =
		uploadStatus === "success" ||
		uploadStatus === "not_complete" ||
		uploadStatus === "error"
			? uploadStatus
			: null;

	return {
		facturas,
		selectedFactura,
		setSelectedFactura,
		uploadStatus,
		ultimaFacturaId,
		statusError,
		isPreviewVisible,
		setIsPreviewVisible,
		completedUploadStatus,
		notifications,
		realApi,
		handleUploadFactura,
		handleManualSubmit,
		handleSelectFactura,
		resetForm,
	};
}
