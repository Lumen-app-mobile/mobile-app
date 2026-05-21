import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/layout/Header/Header";
import StatCard from "@/components/ui/StatCard/StatCard";
import colors from "@/constants/colors";
import type { BalanceResponseDto } from "@/dtos/balance/balance.dtos";
import type { TransactionDto } from "@/dtos/transaction/transaction.dtos";
import { centsToAmount } from "@/mappers/transaction.mapper";
import { obtenerBalance } from "@/services/balance";
import { getSalary } from "@/services/local-storage";
import { listarTransacciones } from "@/services/transactions";

const MONTHS = [
	"Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
	"Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const currencyFormatter = new Intl.NumberFormat("es-ES", {
	style: "currency",
	currency: "EUR",
});

function formatCents(cents: number): string {
	return currencyFormatter.format(centsToAmount(cents));
}

function formatPercent(value: number): string {
	const sign = value >= 0 ? "+" : "";
	return `${sign}${value}%`;
}

function currentMonthName(): string {
	return MONTHS[new Date().getMonth()];
}

function SectionTitle({ title }: { title: string }) {
	return (
		<View
			style={{
				backgroundColor: colors.primary.v1,
				borderColor: colors.base.black,
				borderWidth: 3,
				paddingHorizontal: 16,
				paddingVertical: 10,
			}}>
			<Text
				numberOfLines={1}
				adjustsFontSizeToFit
				style={{
					color: colors.base.white,
					fontFamily: "RedHatMono_700Bold",
					fontSize: 20,
					lineHeight: 26,
				}}>
				{title}
			</Text>
		</View>
	);
}

function SummaryCard({ text }: { text: string }) {
	return (
		<View
			style={{
				backgroundColor: colors.base.white,
				borderColor: colors.base.black,
				borderWidth: 3,
				gap: 16,
				padding: 18,
				shadowColor: colors.base.black,
				shadowOffset: { width: 4, height: 4 },
				shadowOpacity: 1,
				shadowRadius: 1,
				elevation: 5,
			}}>
			<View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
				<MaterialIcons
					name="analytics"
					size={24}
					color={colors.secondary.v1}
				/>
				<Text
					style={{
						color: colors.secondary.v1,
						fontFamily: "RedHatMono_700Bold",
						fontSize: 20,
						lineHeight: 26,
					}}>
					Resumen
				</Text>
			</View>

			<Text
				style={{
					color: colors.base.black,
					fontFamily: "RedHatMono_500Medium",
					fontSize: 16,
					lineHeight: 22,
				}}>
				{text}
			</Text>
		</View>
	);
}

interface CategoryBarProps {
	label: string;
	amount: number;
	total: number;
	color: string;
}

function CategoryBar({ label, amount, total, color }: CategoryBarProps) {
	const pct = total > 0 ? Math.round((amount / total) * 100) : 0;
	return (
		<View style={{ gap: 4 }}>
			<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
				<Text
					style={{
						fontFamily: "RedHatMono_500Medium",
						fontSize: 14,
						lineHeight: 18,
						color: colors.base.black,
					}}>
					{label}
				</Text>
				<Text
					style={{
						fontFamily: "RedHatMono_700Bold",
						fontSize: 14,
						lineHeight: 18,
						color: colors.base.black,
					}}>
					{formatCents(amount)} ({pct}%)
				</Text>
			</View>
			<View
				style={{
					height: 12,
					backgroundColor: colors.secondary.v2,
					borderWidth: 2,
					borderColor: colors.base.black,
					overflow: "hidden",
				}}>
				<View
					style={{
						width: `${pct}%`,
						height: "100%",
						backgroundColor: color,
					}}
				/>
			</View>
		</View>
	);
}

export default function StatsScreen() {
	const [balance, setBalance] = useState<BalanceResponseDto | null>(null);
	const [transactions, setTransactions] = useState<TransactionDto[]>([]);
	const [salaryCents, setSalaryCents] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const isMounted = useRef(true);

	const realApi = !!process.env.EXPO_PUBLIC_API_BASE_URL;

	useFocusEffect(
		useCallback(() => {
			isMounted.current = true;
			if (!realApi) {
				setIsLoading(false);
				return;
			}
			setIsLoading(true);
			Promise.all([obtenerBalance(), listarTransacciones(), getSalary()])
				.then(([bal, txs, salary]) => {
					if (!isMounted.current) return;
					setBalance(bal);
					setTransactions(txs);
					setSalaryCents(salary);
				})
				.catch((err) => {
					if (!isMounted.current) return;
					console.warn("[Stats] Failed to fetch data:", err);
				})
				.finally(() => {
					if (isMounted.current) setIsLoading(false);
				});
			return () => {
				isMounted.current = false;
			};
		}, [realApi]),
	);

	const now = new Date();
	const currMonth = now.getMonth();
	const currYear = now.getFullYear();
	const prevMonth = currMonth === 0 ? 11 : currMonth - 1;
	const prevYear = currMonth === 0 ? currYear - 1 : currYear;

	const currentMonthTx = useMemo(
		() =>
			transactions.filter((tx) => {
				const d = new Date(tx.move_date);
				return d.getMonth() === currMonth && d.getFullYear() === currYear;
			}),
		[transactions, currMonth, currYear],
	);

	const lastMonthTx = useMemo(
		() =>
			transactions.filter((tx) => {
				const d = new Date(tx.move_date);
				return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
			}),
		[transactions, prevMonth, prevYear],
	);

	const totalIncome = balance?.total_income ?? 0;
	const totalExpense = balance?.total_expense ?? 0;
	const currentBalanceVal = balance?.balance ?? 0;

	const currentMonthIncome = useMemo(
		() =>
			currentMonthTx
				.filter((tx) => tx.type === "income")
				.reduce((s, tx) => s + tx.amount, 0),
		[currentMonthTx],
	);

	const currentMonthExpense = useMemo(
		() =>
			currentMonthTx
				.filter((tx) => tx.type === "expense")
				.reduce((s, tx) => s + tx.amount, 0),
		[currentMonthTx],
	);

	const lastMonthExpense = useMemo(
		() =>
			lastMonthTx
				.filter((tx) => tx.type === "expense")
				.reduce((s, tx) => s + tx.amount, 0),
		[lastMonthTx],
	);

	const categoryExpenses = useMemo(() => {
		const expenseTx = currentMonthTx.filter((tx) => tx.type === "expense");
		return {
			obligacion: expenseTx
				.filter((tx) => tx.category.name === "obligacion")
				.reduce((s, tx) => s + tx.amount, 0),
			ocio: expenseTx
				.filter((tx) => tx.category.name === "ocio")
				.reduce((s, tx) => s + tx.amount, 0),
			ahorro: expenseTx
				.filter((tx) => tx.category.name === "ahorro")
				.reduce((s, tx) => s + tx.amount, 0),
		};
	}, [currentMonthTx]);

	const incomeTxCount = useMemo(
		() => currentMonthTx.filter((tx) => tx.type === "income").length,
		[currentMonthTx],
	);
	const expenseTxCount = useMemo(
		() => currentMonthTx.filter((tx) => tx.type === "expense").length,
		[currentMonthTx],
	);

	const avgIncome =
		incomeTxCount > 0 ? currentMonthIncome / incomeTxCount : 0;
	const avgExpense =
		expenseTxCount > 0 ? currentMonthExpense / expenseTxCount : 0;

	const spendingChange =
		lastMonthExpense > 0
			? Math.round(
					((currentMonthExpense - lastMonthExpense) / lastMonthExpense) * 100,
				)
			: null;

	const remainingMoney =
		salaryCents !== null
			? salaryCents - totalExpense
			: currentBalanceVal;

	const savingsRate =
		salaryCents !== null && salaryCents > 0
			? Math.round(
					((salaryCents - currentMonthExpense + currentMonthIncome) /
						salaryCents) *
						100,
				)
			: null;

	const expenseRatio =
		salaryCents !== null && salaryCents > 0
			? Math.round((currentMonthExpense / salaryCents) * 100)
			: null;

	const summaryText = (() => {
		if (transactions.length === 0) {
			return "Aún no hay suficientes datos para generar un resumen. Escanea tu primer ticket para empezar.";
		}

		const monthName = currentMonthName();
		const remaining = formatCents(remainingMoney);

		if (spendingChange === null) {
			return `Este mes de ${monthName} has gastado ${formatCents(currentMonthExpense)} en total. Te quedan ${remaining}${salaryCents !== null ? " de tu sueldo" : ""}.`;
		}

		const direction = spendingChange > 0 ? "más" : "menos";
		const absChange = Math.abs(spendingChange);
		const consejo =
			spendingChange > 0
				? "Revisa posibles mejoras para reducir gastos."
				: "Sigue así, buen trabajo manteniendo los gastos a raya.";

		return `Este mes de ${monthName} has gastado ${formatCents(currentMonthExpense)}, un ${absChange}% ${direction} que el mes pasado. Te quedan ${remaining}${salaryCents !== null ? " de tu sueldo" : ""}. ${consejo}`;
	})();

	if (isLoading) {
		return (
			<SafeAreaView className="flex-1 bg-base-white">
				<Header />
				<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
					<Text
						style={{
							fontFamily: "RedHatMono_500Medium",
							fontSize: 16,
							color: colors.secondary.v2,
						}}>
						Cargando...
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-base-white">
			<Header />

			<ScrollView
				style={{ flex: 1 }}
				showsVerticalScrollIndicator={false}
				contentInsetAdjustmentBehavior="automatic"
				contentContainerStyle={{
					gap: 18,
					paddingBottom: 140,
					paddingHorizontal: 24,
					paddingTop: 16,
				}}>
				<View
					style={{
						alignItems: "center",
						flexDirection: "row",
						justifyContent: "space-between",
						gap: 12,
					}}>
					<Text
						numberOfLines={1}
						adjustsFontSizeToFit
						style={{
							color: colors.base.black,
							flex: 1,
							fontFamily: "RedHatMono_700Bold",
							fontSize: 36,
							lineHeight: 48,
						}}>
						Stats
					</Text>

					<Pressable
						onPress={() => router.back()}
						accessibilityRole="button"
						accessibilityLabel="Volver"
						style={{
							alignItems: "center",
							backgroundColor: colors.base.white,
							borderColor: colors.base.black,
							borderWidth: 3,
							height: 46,
							justifyContent: "center",
							shadowColor: colors.base.black,
							shadowOffset: { width: 4, height: 4 },
							shadowOpacity: 1,
							shadowRadius: 1,
							width: 46,
							elevation: 4,
						}}>
						<MaterialIcons
							name="close"
							size={24}
							color={colors.base.black}
						/>
					</Pressable>
				</View>

				<SummaryCard text={summaryText} />

				{/* Resumen */}
				<View style={{ gap: 14, paddingRight: 4, paddingBottom: 4 }}>
					<SectionTitle title="Resumen" />
					<StatCard
						icon="trending-up"
						reference="Total histórico"
						label="Ingresos totales"
						value={formatCents(totalIncome)}
					/>
					<StatCard
						icon="trending-down"
						reference="Total histórico"
						label="Gastos totales"
						value={formatCents(totalExpense)}
					/>
					<StatCard
						icon="account-balance-wallet"
						reference={salaryCents !== null ? "Sueldo - Gastos" : "Balance"}
						label="Dinero restante"
						value={formatCents(remainingMoney)}
					/>
				</View>

				{/* Este mes */}
				<View style={{ gap: 14, paddingRight: 4, paddingBottom: 4 }}>
					<SectionTitle title={`${currentMonthName()} ${currYear}`} />
					<StatCard
						icon="payments"
						reference="Ingresos"
						label="Ingresos del mes"
						value={formatCents(currentMonthIncome)}
					/>
					<StatCard
						icon="shopping-cart"
						reference="Gastos"
						label="Gastos del mes"
						value={formatCents(currentMonthExpense)}
					/>
					{expenseTxCount > 0 && (
						<StatCard
							icon="receipt"
							reference="Media por transacción"
							label="Gasto medio"
							value={formatCents(avgExpense)}
						/>
					)}
					<StatCard
						icon="receipt-long"
						reference="Número de transacciones"
						label="Transacciones este mes"
						value={`${expenseTxCount + incomeTxCount}`}
					/>
				</View>

				{/* Desglose por categoría */}
				{currentMonthExpense > 0 && (
					<View style={{ gap: 14, paddingRight: 4, paddingBottom: 4 }}>
						<SectionTitle title="Desglose de gastos" />
						<View
							style={{
								backgroundColor: colors.base.white,
								borderColor: colors.base.black,
								borderWidth: 3,
								padding: 18,
								gap: 16,
								shadowColor: colors.base.black,
								shadowOffset: { width: 4, height: 4 },
								shadowOpacity: 1,
								shadowRadius: 1,
								elevation: 5,
							}}>
							<CategoryBar
								label="Obligación"
								amount={categoryExpenses.obligacion}
								total={currentMonthExpense}
								color={colors.primary.v1}
							/>
							<CategoryBar
								label="Ocio"
								amount={categoryExpenses.ocio}
								total={currentMonthExpense}
								color={colors.feedback.danger.v1}
							/>
							<CategoryBar
								label="Ahorro"
								amount={categoryExpenses.ahorro}
								total={currentMonthExpense}
								color={colors.feedback.success.v1}
							/>
						</View>
					</View>
				)}

				{/* Análisis */}
				<View style={{ gap: 14, paddingRight: 4, paddingBottom: 4 }}>
					<SectionTitle title="Análisis" />
					{spendingChange !== null && (
						<StatCard
							icon={spendingChange > 0 ? "trending-up" : "trending-down"}
							reference="vs. mes pasado"
							label="Variación de gastos"
							value={formatPercent(spendingChange)}
						/>
					)}
					{savingsRate !== null && (
						<StatCard
							icon="savings"
							reference="Sueldo - Gastos / Sueldo"
							label="Tasa de ahorro"
							value={`${savingsRate}%`}
						/>
					)}
					{expenseRatio !== null && (
						<StatCard
							icon="percent"
							reference="Gastos / Sueldo"
							label="Gastado del sueldo"
							value={`${expenseRatio}%`}
						/>
					)}
					{salaryCents !== null && (
						<StatCard
							icon="euro"
							reference="Configurado"
							label="Sueldo mensual"
							value={formatCents(salaryCents)}
						/>
					)}
					{incomeTxCount > 0 && (
						<StatCard
							icon="trending-up"
							reference="Media"
							label="Ingreso medio"
							value={formatCents(avgIncome)}
						/>
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
