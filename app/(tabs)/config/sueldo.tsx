import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/layout/Header/Header";
import TextField from "@/components/ui/FormInput/FormInput";
import colors from "@/constants/colors";
import { centsToAmount, amountToCents } from "@/mappers/transaction.mapper";
import { getSalary, setSalary, clearSalary } from "@/services/local-storage";

const currencyFormatter = new Intl.NumberFormat("es-ES", {
	style: "currency",
	currency: "EUR",
	maximumFractionDigits: 0,
});

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

export default function SueldoScreen() {
	const [salaryCents, setSalaryCents] = useState<number | null>(null);
	const [inputValue, setInputValue] = useState("");
	const [isLoaded, setIsLoaded] = useState(false);
	const [saved, setSaved] = useState(false);

	useEffect(() => {
		getSalary().then((cents) => {
			if (cents !== null) {
				setSalaryCents(cents);
				setInputValue(String(centsToAmount(cents)));
			}
			setIsLoaded(true);
		});
	}, []);

	function handleSave() {
		const normalized = inputValue.trim().replace(",", ".");
		const parsed = Number(normalized);

		if (!Number.isFinite(parsed) || parsed <= 0) return;

		const cents = amountToCents(parsed);
		setSalary(cents).then(() => {
			setSalaryCents(cents);
			setSaved(true);
			setTimeout(() => setSaved(false), 2000);
		});
	}

	function handleClear() {
		clearSalary().then(() => {
			setSalaryCents(null);
			setInputValue("");
			setSaved(false);
		});
	}

	if (!isLoaded) return null;

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
						<Text className="font-mono-bold text-4xl leading-[48px] text-base-black">
							Sueldo
						</Text>
						<Text className="font-mono text-base leading-5 text-secondary-v2">
							Guarda tu sueldo mensual para cálculos rápidos sin conexión a la API.
						</Text>

						{salaryCents !== null ? (
							<View className="border-[3px] border-base-black bg-primary-v1 p-4">
								<Text className="font-mono text-xs uppercase leading-[15px] text-base-white">
									Sueldo actual
								</Text>
								<Text
									numberOfLines={1}
									adjustsFontSizeToFit
									className="font-mono-bold text-5xl leading-[58px] text-base-white">
									{currencyFormatter.format(centsToAmount(salaryCents))}
								</Text>
							</View>
						) : (
							<View className="border-[3px] border-base-black bg-secondary-v3 p-4">
								<Text className="font-mono text-base leading-5 text-base-black">
									No has guardado ningún sueldo aún.
								</Text>
							</View>
						)}

						<TextField
							label="Nuevo sueldo mensual"
							state="default"
							size="lg"
							value={inputValue}
							onChangeText={setInputValue}
							placeholder="Ej: 2500"
							keyboardType="numeric"
						/>

						<View className="flex-row gap-3">
							<Pressable
								accessibilityRole="button"
								accessibilityLabel="Guardar sueldo"
								onPress={handleSave}
								className="h-[46px] flex-1 flex-row items-center justify-center gap-2 border-[3px] border-base-black bg-primary-v1 px-[14px] py-[10px] shadow-[4px_4px_1px_black]">
								<MaterialIcons
									name="check"
									size={22}
									color={colors.base.white}
								/>
								<Text className="font-mono-bold text-xs leading-4 text-base-white">
									Guardar
								</Text>
							</Pressable>

							{salaryCents !== null ? (
								<Pressable
									accessibilityRole="button"
									accessibilityLabel="Eliminar sueldo"
									onPress={handleClear}
									className="h-[46px] flex-1 flex-row items-center justify-center gap-2 border-[3px] border-base-black bg-feedback-danger-v1 px-[14px] py-[10px] shadow-[4px_4px_1px_black]">
									<MaterialIcons
										name="delete-outline"
										size={22}
										color={colors.base.white}
									/>
									<Text className="font-mono-bold text-xs leading-4 text-base-white">
										Eliminar
									</Text>
								</Pressable>
							) : null}
						</View>

						{saved ? (
							<Text className="font-mono text-sm leading-4 text-feedback-success-v1">
								Sueldo guardado correctamente
							</Text>
						) : null}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
