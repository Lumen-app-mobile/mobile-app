import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Modal, Pressable, Text, View } from "react-native";

import BrutalButton from "@/components/ui/BrutalButton/BrutalButton";
import colors from "@/constants/colors";

interface FacturaPreviewModalProps {
	visible: boolean;
	uploading: boolean;
	imageUri?: string | null;
	message?: string | null;
	onUpload: () => void;
	onRetake: () => void;
}

export default function FacturaPreviewModal({
	visible,
	uploading,
	imageUri,
	message,
	onUpload,
	onRetake,
}: FacturaPreviewModalProps) {
	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onRetake}
		>
			<View className="flex-1 items-center justify-center bg-base-black/70 px-5">
				<View className="w-full max-w-[390px] gap-4 border-[3px] border-base-black bg-base-white p-4 shadow-[4px_4px_1px_black]">
					<View className="flex-row items-start justify-between gap-3">
						<View className="min-w-0 flex-1">
							<Text className="font-mono-bold text-2xl leading-[32px] text-base-black">
								Previsualización
							</Text>
							<Text className="font-mono text-sm leading-[18px] text-secondary-v2">
								Comprueba que la factura se ve clara antes de subirla.
							</Text>
						</View>
						<Pressable
							accessibilityRole="button"
							accessibilityLabel="Cerrar previsualización"
							onPress={onRetake}
							className="h-[42px] w-[42px] items-center justify-center border-[3px] border-base-black bg-base-white shadow-[4px_4px_1px_black]"
						>
							<MaterialIcons name="close" size={22} color={colors.base.black} />
						</Pressable>
					</View>

					<View className="h-[360px] w-full items-center justify-center border-[3px] border-base-black bg-primary-v4">
						{imageUri ? (
							<Image
								source={{ uri: imageUri }}
								contentFit="contain"
								style={{ width: "100%", height: "100%" }}
							/>
						) : (
							<View className="h-[292px] w-[210px] gap-4 border-[3px] border-base-black bg-base-white p-4">
								<View className="h-4 w-28 bg-primary-v1" />
								<View className="h-3 w-full bg-secondary-v3" />
								<View className="h-3 w-4/5 bg-secondary-v3" />
								<View className="h-24 w-full border-[3px] border-base-black bg-base-white" />
								<View className="h-3 w-full bg-secondary-v3" />
								<View className="h-3 w-3/4 bg-secondary-v3" />
								<View className="mt-auto h-8 w-full bg-primary-v1" />
							</View>
						)}
					</View>

					{message && (
						<Text className="text-center font-mono text-sm text-secondary-v2">
							{message}
						</Text>
					)}

					<View className="flex-row gap-3">
						<View className="min-w-0 flex-1">
							<BrutalButton
								label="Volver a hacer"
								icon="photo-camera"
								variant="secondary"
								fullWidth
								disabled={uploading}
								onPress={onRetake}
							/>
						</View>
						<View className="min-w-0 flex-1">
							<BrutalButton
								label={uploading ? "Subiendo" : "Subir"}
								icon={uploading ? "hourglass-empty" : "upload-file"}
								fullWidth
								disabled={uploading}
								onPress={onUpload}
							/>
						</View>
					</View>
				</View>
			</View>
		</Modal>
	);
}