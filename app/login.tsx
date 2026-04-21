import { router } from "expo-router";
import { useState } from "react";
import { ImageBackground, Modal, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FormInput from "@/components/ui/FormInput";
import colors from "@/constants/colors";

const backgroundImage = {
	uri: `https://picsum.photos/seed/lumen-${Math.floor(Math.random() * 4) + 1}/1200/2200`,
};

type LoginFormProps = {
	onClose: () => void;
	onEnter: () => void;
};

function LoginForm({ onClose, onEnter }: LoginFormProps) {
	return (
		<View
			style={{
				backgroundColor: colors.base.white,
				padding: 24,
				borderTopLeftRadius: 28,
				borderTopRightRadius: 28,
				gap: 18,
			}}>
			<View style={{ alignItems: "center" }}>
				<View
					style={{
						width: 48,
						height: 6,
						borderRadius: 999,
						backgroundColor: colors.primary.v3,
						marginBottom: 16,
					}}
				/>
				<Text
					style={{
						fontSize: 28,
						fontWeight: "700",
						color: colors.base.black,
					}}>
					Login
				</Text>
				<Text
					style={{
						marginTop: 6,
						color: "#666",
						textAlign: "center",
					}}>
					Entra para ver tus pestañas principales.
				</Text>
			</View>

			<FormInput label="Email" placeholder="tu@email.com" size="md" />
			<FormInput
				label="Password"
				placeholder="********"
				size="md"
				secureTextEntry
			/>

			<Pressable
				onPress={onEnter}
				style={{
					backgroundColor: colors.secondary.v1,
					paddingVertical: 14,
					alignItems: "center",
					borderRadius: 16,
				}}>
				<Text
					style={{
						color: colors.base.white,
						fontWeight: "700",
						fontSize: 16,
					}}>
					Entrar
				</Text>
			</Pressable>

			<Pressable onPress={onClose} style={{ alignItems: "center" }}>
				<Text style={{ color: "#666" }}>Cerrar</Text>
			</Pressable>
		</View>
	);
}

export default function LoginScreen() {
	const [isSheetVisible, setIsSheetVisible] = useState(true);

	const openSheet = () => setIsSheetVisible(true);
	const closeSheet = () => setIsSheetVisible(false);
	const enterApp = () => router.replace("./(tabs)");

	const form = <LoginForm onClose={closeSheet} onEnter={enterApp} />;

	return (
		<ImageBackground source={backgroundImage} resizeMode="cover" style={{ flex: 1 }}>
			<View
				style={{
					flex: 1,
					backgroundColor: "rgba(0, 0, 0, 0.28)",
					justifyContent: "space-between",
				}}>
				<SafeAreaView style={{ padding: 24 }}>
					<Text
						style={{
							color: "white",
							fontSize: 36,
							fontWeight: "700",
						}}>
						Lumen
					</Text>
					<Text
						style={{
							color: "white",
							marginTop: 8,
							maxWidth: 260,
						}}>
						Tus finanzas, en una vista clara y simple.
					</Text>
				</SafeAreaView>

				{!isSheetVisible ? (
					<SafeAreaView edges={["bottom"]} style={{ padding: 24 }}>
						<Pressable
							onPress={openSheet}
							style={{
								alignSelf: "center",
								backgroundColor: colors.base.white,
								paddingHorizontal: 20,
								paddingVertical: 12,
								borderRadius: 999,
							}}>
							<Text style={{ fontWeight: "700" }}>Abrir login</Text>
						</Pressable>
					</SafeAreaView>
				) : null}

				<Modal
					animationType="slide"
					transparent
					visible={isSheetVisible}
					onRequestClose={closeSheet}>
					<View
						style={{
							flex: 1,
							justifyContent: "flex-end",
							backgroundColor: "rgba(0, 0, 0, 0.20)",
						}}>
						<SafeAreaView edges={["bottom"]}>{form}</SafeAreaView>
					</View>
				</Modal>
			</View>
		</ImageBackground>
	);
}
