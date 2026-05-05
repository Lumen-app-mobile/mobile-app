import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { FacturaUploadStatus } from "@/domain/factura/factura.types";
import colors from "@/constants/colors";

interface ScanCaptureButtonProps {
  status: FacturaUploadStatus;
  onCapture: () => void;
}

export default function ScanCaptureButton({ status, onCapture }: ScanCaptureButtonProps) {
  const isUploading = status === "uploading";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Hacer foto de factura"
      disabled={isUploading}
      onPress={onCapture}
      style={{
        alignItems: "center",
        backgroundColor: colors.base.white,
        borderColor: colors.base.black,
        borderWidth: 3,
        height: 359,
        justifyContent: "center",
        shadowColor: colors.base.black,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 1,
        width: "100%",
        elevation: 5,
      }}
    >
      <View
        style={{
          alignItems: "center",
          backgroundColor: colors.primary.v1,
          borderColor: colors.base.black,
          borderWidth: 3,
          height: 128,
          justifyContent: "center",
          shadowColor: colors.base.black,
          shadowOffset: { width: 4, height: 4 },
          shadowOpacity: 1,
          shadowRadius: 1,
          width: 128,
          elevation: 5,
        }}
      >
        <MaterialIcons
          name={isUploading ? "hourglass-empty" : "photo-camera"}
          size={64}
          color={colors.base.white}
        />
      </View>

      <Text className="mt-6 font-mono-bold text-2xl leading-[32px] text-base-black">
        {isUploading ? "Subiendo factura" : "Hacer foto"}
      </Text>
      <Text className="mt-2 px-8 text-center font-mono text-sm leading-[18px] text-secondary-v2">
        Captura la factura y revisa la previsualización antes de enviarla.
      </Text>
    </Pressable>
  );
}