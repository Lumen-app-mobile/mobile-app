import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, View } from "react-native";

import BrutalButton from "@/components/ui/BrutalButton/BrutalButton";
import colors from "@/constants/colors";
import { FacturaUploadStatus } from "@/domain/factura/factura.types";

const statusLabels: Record<
	Exclude<FacturaUploadStatus, "idle" | "uploading">,
	{ title: string; detail: string; color: string }
> = {
	success: {
		title: "Factura subida",
		detail: "Se enviará una notificación cuando esté lista para revisar.",
		color: colors.feedback.success.v1,
	},
	not_complete: {
		title: "Factura incompleta",
		detail: "Revisa los campos no detectados o introdúcelos manualmente.",
		color: colors.feedback.warning.v1,
	},
	error: {
		title: "Error al procesar",
		detail: "Puedes reintentar la subida o vincular un producto manualmente.",
		color: colors.feedback.danger.v1,
	},
};

interface StatusCardProps {
	status: Exclude<FacturaUploadStatus, "idle" | "uploading">;
	facturaId: string | null;
	errorMessage?: string;
	onManualPress: () => void;
}

export default function StatusCard({
	status,
	facturaId,
	errorMessage,
	onManualPress,
}: StatusCardProps) {
	const statusInfo = statusLabels[status];

	return (
		<View className="gap-3 border-[3px] border-base-black bg-base-white p-4 shadow-[4px_4px_1px_black]">
			<View className="flex-row items-start gap-3">
				<MaterialIcons
					name={
						status === "success"
							? "check-circle"
							: status === "not_complete"
								? "error-outline"
								: "cancel"
					}
					size={26}
					color={statusInfo.color}
				/>
				<View className="min-w-0 flex-1 gap-1">
					<Text className="font-mono-bold text-xl leading-[26px] text-base-black">
						{statusInfo.title}
					</Text>
					<Text className="font-mono text-sm leading-[18px] text-secondary-v2">
						{errorMessage ?? statusInfo.detail}
					</Text>
				</View>
			</View>

			<View className="flex-row flex-wrap gap-3">
				{facturaId ? (
					<BrutalButton
						label="Ver detalle"
						icon="receipt-long"
						variant="secondary"
						onPress={() => router.push(`/facturas/${facturaId}`)}
					/>
				) : null}
				{status !== "success" ? (
					<BrutalButton
						label="Introducir manualmente"
						icon="edit"
						variant="secondary"
						onPress={onManualPress}
					/>
				) : null}
			</View>
		</View>
	);
}