import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/layout/Header/Header";
import colors from "@/constants/colors";
import type { CategoryDto } from "@/dtos/category/category.dtos";
import type { TransactionDto } from "@/dtos/transaction/transaction.dtos";
import { centsToAmount } from "@/mappers/transaction.mapper";
import { listarCategoriasRaw } from "@/services/categories";
import { actualizarTransaccion, obtenerTransaccion } from "@/services/transactions";

const currencyFormatter = new Intl.NumberFormat("es-ES", {
	style: "currency",
	currency: "EUR",
});

const dateFormatter = new Intl.DateTimeFormat("es-ES", {
	day: "2-digit",
	month: "long",
	year: "numeric",
});

const CATEGORY_COLORS: Record<string, string> = {
	obligacion: colors.primary.v1,
	ocio: colors.feedback.danger.v1,
	ahorro: colors.feedback.success.v1,
};

const CATEGORY_LABELS: Record<string, string> = {
	obligacion: "Obligación",
	ocio: "Ocio",
	ahorro: "Ahorro",
};

function formatAmount(cents: number): string {
	return currencyFormatter.format(centsToAmount(cents));
}

function formatDate(dateStr: string): string {
	const normalized = `${dateStr}`.slice(0, 10);
	if (!normalized) return "";
	const parsed = new Date(`${normalized}T00:00:00`);
	if (isNaN(parsed.getTime())) return dateStr;
	return dateFormatter.format(parsed);
}

function BackButton({ label = "Volver" }: { label?: string }) {
	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel={label}
			onPress={() => router.back()}
			className="h-[46px] flex-row items-center gap-2 self-start border-[3px] border-base-black bg-base-white px-[14px] py-[10px] shadow-[4px_4px_1px_black]">
			<MaterialIcons
				name="arrow-back"
				size={24}
				color={colors.base.black}
			/>
			<Text className="font-mono-bold text-xs leading-4 text-base-black">
				{label}
			</Text>
		</Pressable>
	);
}

function DetailRow({ label, value }: { label: string; value: string }) {
	return (
		<View className="gap-1 border-b-[3px] border-base-black pb-3">
			<Text className="font-mono text-xs uppercase leading-[15px] text-secondary-v2">
				{label}
			</Text>
			<Text className="font-mono-bold text-xl leading-[26px] text-base-black">
				{value}
			</Text>
		</View>
	);
}

function ProductItem({
	name,
	price,
	quantity,
	shopName,
}: {
	name: string;
	price: number;
	quantity: number;
	shopName: string;
}) {
	return (
		<View className="flex-row items-center justify-between border-b-[3px] border-base-black py-3">
			<View className="min-w-0 flex-1 gap-1">
				<Text
					numberOfLines={1}
					className="font-mono-bold text-base leading-5 text-base-black">
					{name}
				</Text>
				{shopName ? (
					<Text className="font-mono text-xs leading-[15px] text-secondary-v2">
						{shopName}
					</Text>
				) : null}
			</View>
			<View className="items-end gap-1">
				<Text className="font-mono-bold text-base leading-5 text-accent2-v2">
					{formatAmount(price)}
				</Text>
				{quantity > 1 ? (
					<Text className="font-mono text-xs leading-[15px] text-secondary-v2">
						x{quantity}
					</Text>
				) : null}
			</View>
		</View>
	);
}

function TransactionNotFound() {
	return (
		<SafeAreaView className="flex-1 bg-base-white">
			<Header />
			<View className="flex-1 justify-center gap-6 px-4">
				<BackButton />
				<View className="gap-4 border-[3px] border-base-black bg-base-white p-5 shadow-[4px_4px_1px_black]">
					<Text className="font-mono-bold text-3xl leading-[38px] text-base-black">
						Transacción no encontrada
					</Text>
					<Text className="font-mono text-base leading-5 text-secondary-v2">
						No hay ninguna transacción con ese identificador.
					</Text>
				</View>
			</View>
		</SafeAreaView>
	);
}

export default function ReciboDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const transactionId = Array.isArray(id) ? id[0] : id;
	const [transaction, setTransaction] = useState<TransactionDto | null>(null);
	const [categories, setCategories] = useState<CategoryDto[]>([]);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isReady, setIsReady] = useState(false);
	const isMounted = useRef(true);

	useFocusEffect(
		useCallback(() => {
			isMounted.current = true;

			if (!transactionId) {
				setIsReady(true);
				return;
			}

			Promise.all([
				obtenerTransaccion(Number(transactionId)),
				listarCategoriasRaw(),
			])
				.then(([tx, cats]) => {
					if (!isMounted.current) return;
					setTransaction(tx);
					setCategories(cats);
				})
				.catch((err) => {
					if (!isMounted.current) return;
					console.warn("[Recibo] Failed to fetch data:", err);
				})
				.finally(() => {
					if (isMounted.current) setIsReady(true);
				});

			return () => {
				isMounted.current = false;
			};
		}, [transactionId]),
	);

	async function handleCategoryChange(categoryId: number) {
		if (!transaction || isUpdating) return;
		setIsUpdating(true);
		try {
			const updated = await actualizarTransaccion(transaction.id, {
				category_id: categoryId,
			});
			setTransaction(updated);
		} catch (err) {
			console.warn("[Recibo] Failed to update category:", err);
		} finally {
			setIsUpdating(false);
		}
	}

	if (!isReady) return null;
	if (!transaction) return <TransactionNotFound />;

	const isIncome = transaction.type === "income";
	return (
		<SafeAreaView className="flex-1 bg-base-white">
			<Header />

			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				alwaysBounceVertical
				contentInsetAdjustmentBehavior="automatic">
				<View className="gap-6 px-4 pb-8 pt-4">
					<BackButton />

					<View className="gap-6 border-[3px] border-base-black bg-base-white p-5 shadow-[4px_4px_1px_black]">
						<View className="min-w-0 flex-1 gap-2">
							<Text className="font-mono text-base leading-5 text-secondary-v2">
								{transaction.company || transaction.description || "Sin etiqueta"}
							</Text>
							<Text className="font-mono-bold text-4xl leading-[48px] text-base-black">
								{isIncome ? "Ingreso" : "Gasto"}
							</Text>
						</View>

						<View
							className={`border-[3px] border-base-black p-4 ${
								isIncome ? "bg-feedback-success-v1" : "bg-primary-v1"
							}`}>
							<Text className="font-mono text-xs uppercase leading-[15px] text-base-white">
								{isIncome ? "Ingresado" : "Total"}
							</Text>
							<Text
								numberOfLines={1}
								adjustsFontSizeToFit
								className="font-mono-bold text-5xl leading-[58px] text-base-white">
								{formatAmount(transaction.amount)}
							</Text>
						</View>

						<View className="gap-4">
							<DetailRow
								label="Tipo"
								value={isIncome ? "Ingreso" : "Gasto"}
							/>
							<DetailRow
								label="Fecha"
								value={formatDate(transaction.move_date)}
							/>
							{transaction.description ? (
								<DetailRow
									label="Descripción"
									value={transaction.description}
								/>
							) : null}
							<DetailRow
								label="Identificador"
								value={String(transaction.id)}
							/>
						</View>

						<View className="gap-3">
							<Text className="font-mono text-xs uppercase leading-[15px] text-secondary-v2">
								Categoría
							</Text>
							<View className="flex-row gap-2">
								{categories
									.filter((c) => c.type === "expense")
									.map((cat) => {
										const isActive = transaction.category_id === cat.id;
										const bgColor = CATEGORY_COLORS[cat.name] || colors.secondary.v2;
										return (
											<Pressable
												key={cat.id}
												disabled={isUpdating}
												onPress={() => handleCategoryChange(cat.id)}
												className={`flex-1 items-center border-[3px] border-base-black py-3 ${
													isActive ? "" : "opacity-40"
												}`}
												style={{
													backgroundColor: isActive ? bgColor : colors.base.white,
												}}>
												<Text
													className={`font-mono-bold text-sm leading-4 ${
														isActive ? "text-base-white" : "text-base-black"
													}`}>
													{CATEGORY_LABELS[cat.name] || cat.name}
												</Text>
											</Pressable>
										);
									})}
							</View>
						</View>
					</View>

					{transaction.products && transaction.products.length > 0 ? (
						<View className="gap-4 border-[3px] border-base-black bg-base-white p-5 shadow-[4px_4px_1px_black]">
							<Text className="font-mono-bold text-2xl leading-[32px] text-base-black">
								Productos
							</Text>
							{transaction.products.map((product) => (
								<ProductItem
									key={product.id}
									name={product.name}
									price={product.price}
									quantity={product.quantity}
									shopName={product.shop_name}
								/>
							))}
						</View>
					) : null}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
