import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/layout/Header/Header";
import StatCard from "@/components/ui/StatCard/StatCard";
import colors from "@/constants/colors";

const INCOME_STATS = [
	{
		icon: "payments" as const,
		reference: "Abril",
		label: "Ingresos mensuales",
		value: "3.450€",
	},
	{
		icon: "receipt-long" as const,
		reference: "Nómina",
		label: "Último ingreso",
		value: "2.200€",
	},
	{
		icon: "trending-up" as const,
		reference: "Media",
		label: "Ingreso medio",
		value: "1.725€",
	},
];

const PROFIT_STATS = [
	{
		icon: "savings" as const,
		reference: "Estimado",
		label: "Beneficio neto",
		value: "1.180€",
	},
	{
		icon: "show-chart" as const,
		reference: "Mes anterior",
		label: "Variación",
		value: "+12%",
	},
	{
		icon: "percent" as const,
		reference: "Margen",
		label: "Beneficio/ingreso",
		value: "34%",
	},
];

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

function SummaryCard() {
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
				Los ingresos cubren gastos y dejan margen positivo. La variación sube
				respecto al mes anterior.
			</Text>
		</View>
	);
}

export default function StatsScreen() {
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

				<SummaryCard />

				<View style={{ gap: 14, paddingRight: 4, paddingBottom: 4 }}>
					<SectionTitle title="Ingresos" />
					{INCOME_STATS.map((stat) => (
						<StatCard
							key={stat.label}
							{...stat}
						/>
					))}
				</View>

				<View style={{ gap: 14, paddingRight: 4, paddingBottom: 4 }}>
					<SectionTitle title="Beneficios" />
					{PROFIT_STATS.map((stat) => (
						<StatCard
							key={stat.label}
							{...stat}
						/>
					))}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
