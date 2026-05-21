import { useRef, useState } from "react";
import {
	CameraView,
	CameraType,
	CameraMode,
	useCameraPermissions,
} from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import type { TransactionDto } from "@/dtos/transaction/transaction.dtos";
import { crearTransaccionConImagen } from "@/services/transactions";

interface Permission {
	granted: boolean;
	canAskAgain: boolean;
	status: string;
}

interface UseScanCameraReturn {
	permission: Permission | null;
	requestPermission: () => Promise<Permission>;
	cameraRef: React.RefObject<CameraView | null>;
	uri: string | null;
	setUri: (uri: string | null) => void;
	mode: CameraMode;
	setMode: (mode: CameraMode) => void;
	facing: CameraType;
	setFacing: (facing: CameraType) => void;
	showCamera: boolean;
	setShowCamera: (show: boolean) => void;
	sending: boolean;
	setSending: (sending: boolean) => void;
	message: string | null;
	setMessage: (message: string | null) => void;
	takePicture: (onPictureTaken?: () => void) => Promise<void>;
	sendInvoice: (onSuccess?: () => void) => Promise<void>;
	toggleFacing: () => void;
	renderCamera: (
		takePicture: () => Promise<void>,
		toggleFacing: () => void,
		onClose: () => void,
	) => React.ReactNode;
}

export function useScanCamera(): UseScanCameraReturn {
	const [permission, requestPermission] = useCameraPermissions();
	const cameraRef = useRef<CameraView>(null);
	const [uri, setUri] = useState<string | null>(null);
	const [mode, setMode] = useState<CameraMode>("picture");
	const [facing, setFacing] = useState<CameraType>("back");
	const [showCamera, setShowCamera] = useState(false);
	const [sending, setSending] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	const takePicture = async (onPictureTaken?: () => void) => {
		const photo = await cameraRef.current?.takePictureAsync({
			shutterSound: false,
			skipProcessing: true,
		});
		if (photo?.uri) {
			setUri(photo.uri);
			setShowCamera(false);
			if (onPictureTaken) {
				onPictureTaken();
			}
		}
	};

	const sendInvoice = async (onSuccess?: () => void) => {
		if (!uri) return;
		setSending(true);
		setMessage(null);
		try {
			const transaction: TransactionDto = await crearTransaccionConImagen(
				{
					type: "expense",
					amount: 0,
					currency: "EUR",
					category_id: 1,
					move_date: new Date().toISOString(),
					process_ocr: true,
				},
				uri,
				"image/jpeg",
				`ticket-${Date.now()}.jpg`,
			);

			setMessage(
				transaction.is_ocr_processed
					? "Factura procesada correctamente"
					: "Factura guardada",
			);
			setUri(null);
			if (onSuccess) {
				onSuccess();
			}
		} catch (error: unknown) {
			const message =
				error instanceof Error ? error.message : "Error de conexión";
			setMessage(`Error: ${message}`);
		} finally {
			setSending(false);
		}
	};

	const toggleFacing = () => {
		setFacing((prev) => (prev === "back" ? "front" : "back"));
	};

	const renderCamera = (
		takePictureFn: () => Promise<void>,
		toggleFacingFn: () => void,
		onClose: () => void,
	) => {
		return (
			<>
				<CameraView
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
					}}
					animateShutter={false}
					ref={cameraRef}
					mode={mode}
					facing={facing}
					mute={true}
					responsiveOrientationWhenOrientationLocked
				/>
				<Pressable
					style={{
						position: "absolute",
						top: 50,
						right: 20,
						zIndex: 1,
						backgroundColor: "rgba(0,0,0,0.5)",
						borderRadius: 20,
						padding: 8,
					}}
					onPress={onClose}>
					<MaterialIcons name="close" size={24} color="white" />
				</Pressable>
				<View
					style={{
						position: "absolute",
						bottom: 44,
						left: 0,
						width: "100%",
						alignItems: "center",
						flexDirection: "row",
						justifyContent: "space-between",
						paddingHorizontal: 30,
					}}>
					<Pressable onPress={onClose}>
						<MaterialIcons name="arrow-back" size={32} color="white" />
					</Pressable>
					<Pressable
						onPress={takePictureFn}
						style={{
							backgroundColor: "transparent",
							borderWidth: 5,
							borderColor: "white",
							width: 85,
							height: 85,
							borderRadius: 45,
							alignItems: "center",
							justifyContent: "center",
						}}>
						<View
							style={{
								width: 70,
								height: 70,
								borderRadius: 50,
								backgroundColor: "white",
							}}
						/>
					</Pressable>
					<Pressable onPress={toggleFacingFn}>
						<MaterialIcons name="flip-camera-ios" size={32} color="white" />
					</Pressable>
				</View>
			</>
		);
	};

	return {
		permission,
		requestPermission,
		cameraRef,
		uri,
		setUri,
		mode,
		setMode,
		facing,
		setFacing,
		showCamera,
		setShowCamera,
		sending,
		setSending,
		message,
		setMessage,
		takePicture,
		sendInvoice,
		toggleFacing,
		renderCamera: (
			takePictureFn: () => Promise<void>,
			toggleFacingFn: () => void,
			onClose: () => void,
		) => renderCamera(takePictureFn, toggleFacingFn, onClose),
	};
}
