import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/layout/Header/Header";
import colors from "@/constants/colors";
import { Factura, FacturaField, FacturaProduct } from "@/domain/factura/factura.types";
import { obtenerTransaccion } from "@/services/transactions";
import { transactionDtoToFactura } from "@/mappers/transaction.mapper";

const currencyFormatter = new Intl.NumberFormat("es-ES", {
	style: "currency",
	currency: "EUR",
});

const statusCopy: Record<Factura["status"], { label: string; color: string }> = {
	pending_review: {
		label: "Pendiente de revisar",
		color: colors.feedback.warning.v1,
	},
	validated: {
		label: "Validada",
		color: colors.feedback.success.v1,
	},
	denied: {
		label: "Denegada",
		color: colors.feedback.danger.v1,
	},
	not_complete: {
		label: "Incompleta",
		color: colors.feedback.warning.v1,
	},
	error: {
		label: "Error",
		color: colors.feedback.danger.v1,
	},
};

function BackButton() {
	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel="Volver"
			onPress={() => router.back()}
			className="h-[46px] flex-row items-center gap-2 self-start border-[3px] border-base-black bg-base-white px-[14px] py-[10px] shadow-[4px_4px_1px_black]">
			<MaterialIcons
				name="arrow-back"
				size={24}
				color={colors.base.black}
			/>
			<Text className="font-mono-bold text-xs leading-4 text-base-black">
				Volver
			</Text>
		</Pressable>
	);
}

function ActionButton({
	label,
	icon,
	variant,
	disabled,
	onPress,
}: {
	label: string;
	icon: keyof typeof MaterialIcons.glyphMap;
	variant: "primary" | "danger";
	disabled?: boolean;
	onPress: () => void;
}) {
	const backgroundColor =
		variant === "primary" ? colors.primary.v1 : colors.feedback.danger.v1;

	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel={label}
			disabled={disabled}
			onPress={onPress}
			className="h-[46px] flex-1 flex-row items-center justify-center gap-2 border-[3px] border-base-black px-[14px] py-[10px] shadow-[4px_4px_1px_black]"
			style={{
				backgroundColor,
				opacity: disabled ? 0.55 : 1,
			}}>
			<MaterialIcons
				name={icon}
				size={22}
				color={colors.base.white}
			/>
			<Text
				numberOfLines={1}
				adjustsFontSizeToFit
				className="font-mono-bold text-xs leading-4 text-base-white">
				{label}
			</Text>
		</Pressable>
	);
}

function FacturaImagePreview() {
	return (
		<View className="h-[300px] w-full items-center justify-center border-[3px] border-base-black bg-base-white shadow-[4px_4px_1px_black]">
			<MaterialIcons
				name="receipt-long"
				size={120}
				color={colors.primary.v1}
			/>
			<Text className="font-mono-bold text-base leading-5 text-base-black">
				Preview factura
			</Text>
		</View>
	);
}

function FieldRow({ field }: { field: FacturaField }) {
	const isProblem = field.status !== "complete";
	const color = isProblem ? colors.feedback.warning.v1 : colors.feedback.success.v1;

	return (
		<View className="gap-2 border-b-[3px] border-base-black pb-3">
			<View className="flex-row items-center justify-between gap-3">
				<Text className="font-mono text-xs uppercase leading-[15px] text-secondary-v2">
					{field.label}
				</Text>
				<View className="flex-row items-center gap-1">
					<MaterialIcons
						name={isProblem ? "error-outline" : "check-circle"}
						size={16}
						color={color}
					/>
					<Text
						className="font-mono text-xs leading-[15px]"
						style={{ color }}>
						{Math.round(field.confidence * 100)}%
					</Text>
				</View>
			</View>
			<Text className="font-mono-bold text-xl leading-[26px] text-base-black">
				{field.value || "Pendiente"}
			</Text>
		</View>
	);
}

function ProductRow({ product }: { product: FacturaProduct }) {
	return (
		<View className="gap-2 border-b-[3px] border-base-black pb-3">
			<View className="flex-row items-start justify-between gap-3">
				<View className="min-w-0 flex-1">
					<Text
						numberOfLines={1}
						className="font-mono-bold text-base leading-5 text-base-black">
						{product.name}
					</Text>
					<Text
						numberOfLines={1}
						className="font-mono text-xs leading-[15px] text-secondary-v2">
						{product.market} · {product.category} · {product.source}
					</Text>
				</View>
				<Text className="font-mono-bold text-base leading-5 text-accent2-v2">
					{currencyFormatter.format(product.amount)}
				</Text>
			</View>
		</View>
	);
}

function FacturaNotFound() {
	return (
		<SafeAreaView className="flex-1 bg-base-white">
			<Header />
			<View className="flex-1 justify-center gap-6 px-4">
				<BackButton />
				<View className="gap-4 border-[3px] border-base-black bg-base-white p-5 shadow-[4px_4px_1px_black]">
					<Text className="font-mono-bold text-3xl leading-[38px] text-base-black">
						Factura no encontrada
					</Text>
					<Text className="font-mono text-base leading-5 text-secondary-v2">
						No hay ninguna factura con ese identificador.
					</Text>
				</View>
			</View>
		</SafeAreaView>
	);
}

export default function FacturaDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const facturaId = Array.isArray(id) ? id[0] : id;
	const [factura, setFactura] = useState<Factura | null>(null);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (!facturaId) return;

		const id = Number(facturaId);
		if (Number.isNaN(id)) {
			console.warn(`[FacturaDetail] Invalid facturaId: ${facturaId}`);
			setLoading(false);
			return;
		}

		obtenerTransaccion(id)
			.then((dto) => {
				setFactura(transactionDtoToFactura(dto));
				setLoading(false);
			})
			.catch((err) => {
				console.warn(`[FacturaDetail] Error fetching factura ${facturaId}:`, err);
				setLoading(false);
			});
	}, [facturaId]);

	async function handleValidate() {
		if (!factura) return;
		setSubmitting(true);
		try {
			console.warn("[FacturaDetail] Validate API not implemented yet");
		} finally {
			setSubmitting(false);
		}
	}

	async function handleDeny() {
		if (!factura) return;
		setSubmitting(true);
		try {
			console.warn("[FacturaDetail] Deny API not implemented yet");
		} finally {
			setSubmitting(false);
		}
	}

	if (loading) {
		return (
			<SafeAreaView className="flex-1 bg-base-white">
				<Header />
				<View className="flex-1 items-center justify-center">
					<Text className="font-mono-bold text-xl leading-[26px] text-base-black">
						Cargando factura
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	if (!factura) return <FacturaNotFound />;

	const currentStatus = statusCopy[factura.status];
	const canReview =
		factura.status === "pending_review" || factura.status === "not_complete";

	return (
		<SafeAreaView className="flex-1 bg-base-white">
			<Header />

			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				alwaysBounceVertical
				contentInsetAdjustmentBehavior="automatic">
				<View className="gap-6 px-4 pb-12 pt-4">
					<BackButton />

					<View className="gap-3">
						<Text
							numberOfLines={2}
							className="font-mono-bold text-4xl leading-[48px] text-base-black">
							{factura.displayName}
						</Text>
						<View
							className="self-start border-[3px] border-base-black px-3 py-2"
							style={{ backgroundColor: currentStatus.color }}>
							<Text className="font-mono-bold text-xs leading-[15px] text-base-white">
								{currentStatus.label}
							</Text>
						</View>
					</View>

					<FacturaImagePreview />

					<View className="gap-4 border-[3px] border-base-black bg-base-white p-4 shadow-[4px_4px_1px_black]">
						<Text className="font-mono-bold text-2xl leading-[32px] text-base-black">
							Campos detectados
						</Text>
						{factura.fields.map((field) => (
							<FieldRow
								key={field.key}
								field={field}
							/>
						))}
					</View>

					<View className="gap-4 border-[3px] border-base-black bg-base-white p-4 shadow-[4px_4px_1px_black]">
						<Text className="font-mono-bold text-2xl leading-[32px] text-base-black">
							Productos
						</Text>
						{factura.products.length > 0 ? (
							factura.products.map((product) => (
								<ProductRow
									key={product.id}
									product={product}
								/>
							))
						) : (
							<Text className="font-mono text-base leading-5 text-secondary-v2">
								Todavía no hay productos vinculados.
							</Text>
						)}
					</View>

					<View className="flex-row gap-3">
						<ActionButton
							label="Validar"
							icon="check"
							variant="primary"
							disabled={!canReview || submitting}
							onPress={handleValidate}
						/>
						<ActionButton
							label="Denegar"
							icon="close"
							variant="danger"
							disabled={!canReview || submitting}
							onPress={handleDeny}
						/>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
