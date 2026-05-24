import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import colors from "@/constants/colors";

interface FileUploadPanelProps {
  onPickFile: () => void;
}

export default function FileUploadPanel({ onPickFile }: FileUploadPanelProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Seleccionar archivo"
      onPress={onPickFile}
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
          backgroundColor: colors.accent1.v1,
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
          name="attach-file"
          size={64}
          color={colors.base.black}
        />
      </View>

      <Text className="mt-6 font-mono-bold text-2xl leading-[32px] text-base-black">
        Seleccionar archivo
      </Text>
      <Text className="mt-2 px-8 text-center font-mono text-sm leading-[18px] text-secondary-v2">
        Elige una imagen o PDF de la factura desde tu dispositivo.
      </Text>
    </Pressable>
  );
}
