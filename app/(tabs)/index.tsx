import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/layout/Header/Header";
import StatCard from "@/components/ui/StatCard/StatCard";
import colors from "@/constants/colors";

const HOME_STATS = [
	{
		icon: "receipt-long" as const,
		reference: "Seguro coche",
		label: "Último recibo",
		value: "$300.00",
	},
	{
		icon: "euro" as const,
		reference: "Total",
		label: "Total Spent",
		value: "$4,250.00",
	},
	{
		icon: "euro" as const,
		reference: "Cuenta",
		label: "Dinero restante",
		value: "$750.00",
	},
];

function UpdatesCard() {
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
					últimas actualizaciones
				</Text>
			</View>

			<View
				style={{
					width: "100%",
					backgroundColor: colors.primary.v1,
					padding: 4,
					flexDirection: "row",
					alignItems: "flex-end",
					justifyContent: "flex-end",
					gap: 10,
				}}>
				<Text
					style={{
						fontFamily: "RedHatMono_700Bold",
						fontSize: 48,
						lineHeight: 64,
						color: colors.base.black,
					}}>
					2.200€
				</Text>
				<Text
					style={{
						flex: 1,
						fontFamily: "RedHatMono_500Medium",
						fontSize: 20,
						lineHeight: 26,
						color: colors.base.white,
						textAlign: "right",
					}}>
					Nómina
				</Text>
			</View>

			<Text
				style={{
					fontFamily: "RedHatMono_500Medium",
					fontSize: 20,
					lineHeight: 26,
					color: colors.feedback.success.v1,
				}}>
				Ahorros
			</Text>
		</View>
	);
}

function AnalysisCard() {
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
						Analysis
					</Text>
				</View>

				<View
					style={{
						width: "100%",
						padding: 8,
						gap: 8,
					}}>
					<Text
						style={{
							fontFamily: "RedHatMono_500Medium",
							fontSize: 36,
							lineHeight: 48,
							color: colors.feedback.danger.v1,
						}}>
						24%
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
							Alto
						</Text>
						<Text
							style={{
								fontFamily: "RedHatMono_700Bold",
								fontSize: 16,
								lineHeight: 21,
								color: colors.feedback.danger.v1,
							}}>
							Más que el mes pasado
						</Text>
					</View>

					<Text
						style={{
							fontFamily: "RedHatMono_500Medium",
							fontSize: 16,
							lineHeight: 21,
							color: colors.feedback.success.v1,
						}}>
						Revisar posibles mejoras
					</Text>
				</View>
			</View>

			<View style={{ alignItems: "flex-end", paddingTop: 32 }}>
				<Pressable
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
					{HOME_STATS.map((stat) => (
						<StatCard
							key={stat.label}
							icon={stat.icon}
							reference={stat.reference}
							label={stat.label}
							value={stat.value}
						/>
					))}
				</View>

				<UpdatesCard />
				<AnalysisCard />
			</ScrollView>
		</SafeAreaView>
	);
}
