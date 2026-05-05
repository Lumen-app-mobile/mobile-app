import { Redirect, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
	Animated,
	Dimensions,
	ImageBackground,
	Pressable,
	Text,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TextField from "@/components/ui/FormInput/FormInput";
import colors from "@/constants/colors";
import { useAuth } from "@/lib/auth";
import Logo from "@/assets/images/logo.svg";

const backgroundImage = require("@/assets/images/Gemini_Generated_Image_9vrbv69vrbv69vrb.webp");

const SCREEN_HEIGHT = Dimensions.get("window").height;

type LoginFormProps = {
	onClose: () => void;
	onEnter: (email: string, password: string) => void;
};

// Hoja inferior con los campos del login y las acciones de entrar/cerrar.
function LoginForm({ onClose, onEnter }: LoginFormProps) {
	// Estado local del formulario antes de enviarlo a Firebase.
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleEnter = async () => {
		setError("");
		setLoading(true);
		try {
			await onEnter(email, password);
		} catch {
			setError("Email o contraseña incorrectos.");
		} finally {
			setLoading(false);
		}
	};

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

			<TextField
				label="Email"
				placeholder="tu@email.com"
				size="md"
				value={email}
				onChangeText={setEmail}
				autoCapitalize="none"
				keyboardType="email-address"
			/>
			<TextField
				label="Password"
				placeholder="********"
				size="md"
				secureTextEntry
				value={password}
				onChangeText={setPassword}
			/>

			{error ? (
				<Text style={{ color: colors.feedback.danger.v1, textAlign: "center" }}>
					{error}
				</Text>
			) : null}

			<Pressable
				onPress={handleEnter}
				disabled={loading}
				style={{
					backgroundColor: colors.secondary.v1,
					paddingVertical: 14,
					alignItems: "center",
					borderRadius: 16,
					opacity: loading ? 0.6 : 1,
				}}>
				<Text
					style={{
						color: colors.base.white,
						fontWeight: "700",
						fontSize: 16,
					}}>
					{loading ? "Entrando..." : "Entrar"}
				</Text>
			</Pressable>

			<Pressable
				onPress={onClose}
				style={{ alignItems: "center" }}>
				<Text style={{ color: "#666" }}>Cerrar</Text>
			</Pressable>
		</View>
	);
}

export default function LoginScreen() {
	const { isInitializing, signIn, user } = useAuth();
	// Controla si el bottom sheet del login está abierto o cerrado.
	const [isSheetVisible, setIsSheetVisible] = useState(true);

	const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

	useEffect(() => {
		if (isSheetVisible) {
			Animated.spring(slideAnim, {
				toValue: 0,
				useNativeDriver: true,
				bounciness: 4,
				speed: 14,
			}).start();
		} else {
			Animated.timing(slideAnim, {
				toValue: SCREEN_HEIGHT,
				duration: 280,
				useNativeDriver: true,
			}).start();
		}
	}, [isSheetVisible, slideAnim]);

	const openSheet = () => setIsSheetVisible(true);
	const closeSheet = () => setIsSheetVisible(false);

	// Intenta autenticar al usuario y, si funciona, entra en la zona principal de la app.
	const enterApp = async (email: string, password: string) => {
		try {
			await signIn(email, password);
			router.replace("/(tabs)");
		} catch (error: any) {
			console.log(`${error.code}: ${error.message}`);
			throw `${error.code}: ${error.message}`;
		}
	};

	if (isInitializing) return <View style={{ flex: 1 }} />;
	if (user) return <Redirect href="/(tabs)" />;

	return (
		<View style={{ flex: 1, overflow: "hidden" }}>
			{/* Imagen cubre toda la pantalla como fondo absoluto */}
			<ImageBackground
				source={backgroundImage}
				resizeMode="cover"
				style={{
					position: "absolute",
					top: 0,
					bottom: 0,
					left: 0,
					right: 0,
				}}>
				<View
					style={{ flex: 1, backgroundColor: "rgba(255, 255, 255, 0.6)" }}
				/>
			</ImageBackground>

			{/* Título posicionado absolutamente arriba */}
			<SafeAreaView
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					padding: 24,
				}}>
				<Logo
					width={140}
					height={40}
				/>
			</SafeAreaView>

			{/* Bottom sheet animado deslizando desde abajo */}
			<Animated.View
				style={{
					transform: [{ translateY: slideAnim }],
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0,
				}}>
				<SafeAreaView edges={["bottom"]}>
					<LoginForm
						onClose={closeSheet}
						onEnter={enterApp}
					/>
				</SafeAreaView>
			</Animated.View>

			{!isSheetVisible ? (
				<SafeAreaView
					edges={["bottom"]}
					style={{
						position: "absolute",
						bottom: 0,
						left: 0,
						right: 0,
						padding: 24,
					}}>
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
		</View>
	);
}
