import { useEffect, useState } from "react";
import {
  agregarProductoManualAFactura,
  listarFacturas,
  subirFacturaMock,
} from "@/services/facturas";
import { Factura, FacturaUploadStatus } from "@/domain/factura/factura.types";
import { ProductCategory } from "@/components/ui/CategorySelect/CategorySelect";

export function useFacturaManagement() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
  const [uploadStatus, setUploadStatus] = useState<FacturaUploadStatus>("idle");
  const [ultimaFacturaId, setLastFacturaId] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | undefined>();
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  useEffect(() => {
    listarFacturas(5).then((nextFacturas) => {
      setFacturas(nextFacturas);
      setSelectedFactura(
        (currentFactura) => currentFactura ?? nextFacturas[0] ?? null,
      );
    });
  }, []);

  async function handleUploadFactura() {
    setUploadStatus("uploading");
    setStatusError(undefined);

    const result = await subirFacturaMock();
    setUploadStatus(result.status);
    setLastFacturaId(result.facturaId ?? null);
    setStatusError(result.errorMessage);
    setIsPreviewVisible(false);

    const nextFacturas = await listarFacturas(5);
    setFacturas(nextFacturas);
    if (result.facturaId) {
      const uploadedFactura = nextFacturas.find(
        (factura) => factura.id === result.facturaId,
      );
      setSelectedFactura(uploadedFactura ?? nextFacturas[0] ?? null);
    }
  }

  async function handleManualSubmit(
    selectedFactura: Factura | null,
    name: string,
    category: ProductCategory,
    amount: string,
    market: string,
    onSuccess: () => void,
  ) {
    const parsedAmount = Number(amount.trim().replace(",", "."));

    if (
      !selectedFactura ||
      !name.trim() ||
      !market.trim() ||
      !Number.isFinite(parsedAmount)
    ) {
      setUploadStatus("error");
      setStatusError("Selecciona una factura y completa todos los campos.");
      return;
    }

    const updatedFactura = await agregarProductoManualAFactura(
      selectedFactura.id,
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
    setFacturas(await listarFacturas(5));
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
    handleUploadFactura,
    handleManualSubmit,
    handleSelectFactura,
    resetForm,
  };
}