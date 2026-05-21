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

const currencyFormatter = new Intl.NumberFormat("es-ES", {
	style: "currency",
	currency: "EUR",
});

function formatAmount(cents: number): string {
	return currencyFormatter.format(centsToAmount(cents));
}

function UpdatesCard({
	latestTransaction,
}: {
	latestTransaction: TransactionDto | null;
}) {
	if (!latestTransaction) {
		return (
			<View
				style={{
					width: "100%",
					height: 232,
					backgroundColor: colors.base.white,
					borderWidth: 3,
					borderColor: colors.base.black,
					padding: 16,
					justifyContent: "center",
					alignItems: "center",
					shadowColor: colors.base.black,
					shadowOffset: { width: 4, height: 4 },
					shadowOpacity: 1,
					shadowRadius: 1,
					elevation: 5,
				}}>
				<Text
					style={{
						fontFamily: "RedHatMono_500Medium",
						fontSize: 16,
						lineHeight: 21,
						color: colors.secondary.v2,
						textAlign: "center",
					}}>
					No hay transacciones aún
				</Text>
			</View>
		);
	}

	const isIncome = latestTransaction.type === "income";

	return (
		<View
			style={{
				width: "100%",
				height: 232,
				backgroundColor: colors.base.white,
				borderWidth: 3,
				borderColor: colors.base.black,
				padding: 16,
				justifyContent: "space-between",
				shadowColor: colors.base.black,
				shadowOffset: { width: 4, height: 4 },
				shadowOpacity: 1,
				shadowRadius: 1,
				elevation: 5,
			}}>
			<View style={{ alignItems: "flex-end", width: "100%" }}>
				<Text
					style={{
						fontFamily: "RedHatMono_500Medium",
						fontSize: 20,
						lineHeight: 26,
						color: colors.secondary.v2,
						textAlign: "right",
					}}>
					última transacción
				</Text>
			</View>

			<View
				style={{
					width: "100%",
					backgroundColor: isIncome
						? colors.feedback.success.v1
						: colors.primary.v1,
					padding: 4,
					flexDirection: "row",
					alignItems: "flex-end",
					justifyContent: "flex-end",
					gap: 10,
				}}>
				<Text
					numberOfLines={1}
					adjustsFontSizeToFit
					style={{
						fontFamily: "RedHatMono_700Bold",
						fontSize: 48,
						lineHeight: 64,
						color: colors.base.black,
					}}>
					{formatAmount(latestTransaction.amount)}
				</Text>
				<Text
					numberOfLines={1}
					style={{
						flex: 1,
						fontFamily: "RedHatMono_500Medium",
						fontSize: 20,
						lineHeight: 26,
						color: colors.base.white,
						textAlign: "right",
					}}>
					{latestTransaction.company || latestTransaction.description || "Sin etiqueta"}
				</Text>
			</View>

			<Text
				style={{
					fontFamily: "RedHatMono_500Medium",
					fontSize: 20,
					lineHeight: 26,
					color: isIncome
						? colors.feedback.success.v1
						: colors.feedback.danger.v1,
				}}>
				{isIncome ? "Ingreso" : "Gasto"}
			</Text>
		</View>
	);
}

function AnalysisCard({
	spendingChange,
	categoryExpenses,
	currentMonthExpense,
}: {
	spendingChange: number | null;
	categoryExpenses: { obligacion: number; ocio: number; ahorro: number } | null;
	currentMonthExpense: number;
}) {
	const isHigher = spendingChange !== null && spendingChange > 0;
	const isEmpty = spendingChange === null;
	const hasCategories = categoryExpenses !== null && currentMonthExpense > 0;

	function MiniBar({
		label,
		amount,
		color,
	}: {
		label: string;
		amount: number;
		color: string;
	}) {
		const pct =
			currentMonthExpense > 0
				? Math.round((amount / currentMonthExpense) * 100)
				: 0;
		return (
			<View style={{ gap: 2, flex: 1 }}>
				<Text
					style={{
						fontFamily: "RedHatMono_500Medium",
						fontSize: 10,
						lineHeight: 14,
						color: colors.base.black,
					}}>
					{label} {pct}%
				</Text>
				<View
					style={{
						height: 8,
						backgroundColor: colors.secondary.v2,
						borderWidth: 1.5,
						borderColor: colors.base.black,
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

	return (
		<View
			style={{
				width: "100%",
				backgroundColor: colors.base.white,
				borderWidth: 3,
				borderColor: colors.base.black,
				padding: 35,
				justifyContent: "space-between",
				shadowColor: "#111111",
				shadowOffset: { width: 8, height: 8 },
				shadowOpacity: 1,
				shadowRadius: 0,
				elevation: 8,
			}}>
			<View style={{ gap: 16 }}>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
					}}>
					<MaterialIcons
						name="bar-chart"
						size={24}
						color={colors.primary.v1}
					/>
					<Text
						style={{
							fontFamily: "RedHatMono_500Medium",
							fontSize: 24,
							lineHeight: 32,
							color: colors.primary.v1,
						}}>
						Análisis
					</Text>
				</View>

				<View
					style={{
						width: "100%",
						padding: 8,
						gap: 8,
					}}>
					{isEmpty && !hasCategories ? (
						<Text
							style={{
								fontFamily: "RedHatMono_500Medium",
								fontSize: 16,
								lineHeight: 21,
								color: colors.secondary.v2,
							}}>
							No hay datos suficientes para analizar
						</Text>
					) : (
						<>
							{spendingChange !== null && (
								<>
									<Text
										style={{
											fontFamily: "RedHatMono_500Medium",
											fontSize: 36,
											lineHeight: 48,
											color: isHigher
												? colors.feedback.danger.v1
												: colors.feedback.success.v1,
										}}>
										{isHigher ? "+" : ""}
										{spendingChange}%
									</Text>

									<View
										style={{
											flexDirection: "row",
											alignItems: "flex-start",
											gap: 8,
										}}>
										<Text
											style={{
												fontFamily: "RedHatMono_500Medium",
												fontSize: 16,
												lineHeight: 21,
												color: colors.base.black,
											}}>
											{isHigher ? "Alto" : "Bajo"}
										</Text>
										<Text
											style={{
												fontFamily: "RedHatMono_700Bold",
												fontSize: 16,
												lineHeight: 21,
												color: isHigher
													? colors.feedback.danger.v1
													: colors.feedback.success.v1,
											}}>
											{isHigher
												? "Más que el mes pasado"
												: "Menos que el mes pasado"}
										</Text>
									</View>

									<Text
										style={{
											fontFamily: "RedHatMono_500Medium",
											fontSize: 16,
											lineHeight: 21,
											color: colors.feedback.success.v1,
										}}>
										{isHigher
											? "Revisar posibles mejoras"
											: "Buen trabajo"}
									</Text>
								</>
							)}

							{hasCategories && (
								<View
									style={{
										marginTop: 16,
										paddingTop: 16,
										borderTopWidth: 2,
										borderTopColor: colors.secondary.v2,
										gap: 12,
									}}>
									<Text
										style={{
											fontFamily: "RedHatMono_700Bold",
											fontSize: 14,
											lineHeight: 18,
											color: colors.base.black,
										}}>
										Gastos por categoría
									</Text>
									<View style={{ gap: 8 }}>
										<MiniBar
											label="Obligación"
											amount={categoryExpenses!.obligacion}
											color={colors.primary.v1}
										/>
										<MiniBar
											label="Ocio"
											amount={categoryExpenses!.ocio}
											color={colors.feedback.danger.v1}
										/>
										<MiniBar
											label="Ahorro"
											amount={categoryExpenses!.ahorro}
											color={colors.feedback.success.v1}
										/>
									</View>
								</View>
							)}
						</>
					)}
				</View>
			</View>

			<View style={{ alignItems: "flex-end", paddingTop: 32 }}>
				<Pressable
					onPress={() => router.push("/stats")}
					accessibilityRole="button"
					accessibilityLabel="Ver stats"
					style={{
						backgroundColor: colors.secondary.v1,
						borderWidth: 3,
						borderColor: colors.base.black,
						paddingHorizontal: 19,
						paddingVertical: 11,
						flexDirection: "row",
						alignItems: "center",
						gap: 8,
						shadowColor: colors.base.black,
						shadowOffset: { width: 4, height: 4 },
						shadowOpacity: 1,
						shadowRadius: 0,
						elevation: 5,
					}}>
					<MaterialIcons
						name="arrow-forward"
						size={24}
						color={colors.base.white}
					/>
					<Text
						style={{
							fontFamily: "RedHatMono_500Medium",
							fontSize: 12,
							lineHeight: 16,
							color: colors.base.white,
							textAlign: "center",
						}}>
						ver stats
					</Text>
				</Pressable>
			</View>
		</View>
	);
}

export default function HomeScreen() {
	const [balance, setBalance] = useState<BalanceResponseDto | null>(null);
	const [transactions, setTransactions] = useState<TransactionDto[]>([]);
	const [salaryCents, setSalaryCents] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const realApi = !!process.env.EXPO_PUBLIC_API_BASE_URL;
	const isMounted = useRef(true);

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
					console.warn("[Home] Failed to fetch data:", err);
				})
				.finally(() => {
					if (!isMounted.current) return;
					setIsLoading(false);
				});

			return () => {
				isMounted.current = false;
			};
		}, [realApi]),
	);

	const latestTransaction = useMemo(
		() => transactions[0] ?? null,
		[transactions],
	);

	const spendingChange = useMemo(() => {
		if (transactions.length === 0) return null;

		const now = new Date();
		const currentMonth = now.getMonth();
		const currentYear = now.getFullYear();
		const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
		const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

		const currentMonthExpenses = transactions
			.filter((tx) => {
				const d = new Date(tx.move_date);
				return (
					d.getMonth() === currentMonth &&
					d.getFullYear() === currentYear &&
					tx.type === "expense"
				);
			})
			.reduce((sum, tx) => sum + tx.amount, 0);

		const lastMonthExpenses = transactions
			.filter((tx) => {
				const d = new Date(tx.move_date);
				return (
					d.getMonth() === lastMonth &&
					d.getFullYear() === lastMonthYear &&
					tx.type === "expense"
				);
			})
			.reduce((sum, tx) => sum + tx.amount, 0);

		if (lastMonthExpenses === 0) return null;

		return Math.round(
			((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100,
		);
	}, [transactions]);

	const now = new Date();
	const currMonth = now.getMonth();
	const currYear = now.getFullYear();

	const currentMonthTx = useMemo(
		() =>
			transactions.filter((tx) => {
				const d = new Date(tx.move_date);
				return d.getMonth() === currMonth && d.getFullYear() === currYear;
			}),
		[transactions, currMonth, currYear],
	);

	const currentMonthExpense = useMemo(
		() =>
			currentMonthTx
				.filter((tx) => tx.type === "expense")
				.reduce((s, tx) => s + tx.amount, 0),
		[currentMonthTx],
	);

	const categoryExpenses = useMemo(() => {
		const expenseTx = currentMonthTx.filter((tx) => tx.type === "expense");
		if (expenseTx.length === 0) return null;
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

	const lastAmount = latestTransaction?.amount ?? 0;
	const totalExpense = balance?.total_expense ?? 0;
	const remainingMoney =
		salaryCents !== null
			? salaryCents - totalExpense
			: (balance?.balance ?? 0);

	function handleNotificationsPress() {}

	return (
		<SafeAreaView className="flex-1 bg-base-white">
			<Header onNotificationsPress={handleNotificationsPress} />

			<ScrollView
				style={{ flex: 1 }}
				showsVerticalScrollIndicator={false}
				alwaysBounceVertical
				contentInsetAdjustmentBehavior="automatic"
				contentContainerStyle={{
					paddingHorizontal: 24,
					paddingTop: 8,
					paddingBottom: 140,
					gap: 16,
				}}>
				<Text
					style={{
						fontFamily: "RedHatMono_700Bold",
						fontSize: 36,
						lineHeight: 48,
						color: colors.base.black,
					}}>
					Inicio
				</Text>

				<View style={{ gap: 32, paddingTop: 8 }}>
					<Pressable
						accessibilityRole="button"
						accessibilityLabel="Ver detalle del último recibo"
						onPress={() => {
							if (latestTransaction) {
								router.push({
									pathname: "recibo/[id]",
									params: { id: String(latestTransaction.id) },
								});
							}
						}}>
						<StatCard
							icon="receipt-long"
							reference={
								latestTransaction?.company ||
								latestTransaction?.description ||
								"Sin transacciones"
							}
							label="Último recibo"
							value={isLoading ? "—" : formatAmount(lastAmount)}
						/>
					</Pressable>
					<StatCard
						icon="euro"
						reference="Total"
						label="Total gastado"
						value={isLoading ? "—" : formatAmount(totalExpense)}
					/>
					<StatCard
						icon="euro"
						reference={salaryCents !== null ? "Sueldo" : "Cuenta"}
						label="Dinero restante"
						value={isLoading ? "—" : formatAmount(remainingMoney)}
					/>
				</View>

				<UpdatesCard latestTransaction={latestTransaction} />
				<AnalysisCard
					spendingChange={spendingChange}
					categoryExpenses={categoryExpenses}
					currentMonthExpense={currentMonthExpense}
				/>
			</ScrollView>
		</SafeAreaView>
	);
}
