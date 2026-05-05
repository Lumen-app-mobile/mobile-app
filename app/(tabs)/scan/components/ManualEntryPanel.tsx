import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import BrutalButton from "@/components/ui/BrutalButton/BrutalButton";
import CategorySelect, {
  ProductCategory,
} from "@/components/ui/CategorySelect/CategorySelect";
import TextField from "@/components/ui/FormInput/FormInput";
import { Factura } from "@/domain/factura/factura.types";
import colors from "@/constants/colors";

interface ManualEntryPanelProps {
  selectedFactura: Factura | null;
  name: string;
  category: ProductCategory;
  amount: string;
  market: string;
  onAmountChange: (value: string) => void;
  onCategoryChange: (value: ProductCategory) => void;
  onMarketChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onOpenManualFlow: () => void;
  onManualSubmit: () => void;
}

export default function ManualEntryPanel({
  selectedFactura,
  name,
  category,
  amount,
  market,
  onAmountChange,
  onCategoryChange,
  onMarketChange,
  onNameChange,
  onOpenManualFlow,
  onManualSubmit,
}: ManualEntryPanelProps) {
  return (
    <View className="gap-5 border-[3px] border-base-black bg-base-white p-4 shadow-[4px_4px_1px_black]">
      {selectedFactura ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cambiar factura seleccionada"
          onPress={onOpenManualFlow}
          className="flex-row items-center justify-between gap-3 border-[3px] border-base-black bg-primary-v4 p-3"
        >
          <View className="min-w-0 flex-1">
            <Text
              numberOfLines={1}
              className="font-mono text-xs leading-[15px] text-secondary-v2"
            >
              Factura seleccionada
            </Text>
            <Text
              numberOfLines={1}
              className="font-mono-bold text-base leading-5 text-base-black"
            >
              {selectedFactura.displayName}
            </Text>
          </View>
          <MaterialIcons
            name="expand-more"
            size={24}
            color={colors.base.black}
          />
        </Pressable>
      ) : null}

      <TextField
        label="Nombre"
        value={name}
        onChangeText={onNameChange}
        placeholder="Nombre del producto"
        size="md"
      />

      <View className="gap-5 md:flex-row">
        <View className="min-w-0 flex-1">
          <TextField
            label="Importe"
            value={amount}
            onChangeText={onAmountChange}
            placeholder="0,00"
            keyboardType="numeric"
            size="md"
          />
        </View>
        <View className="min-w-0 flex-1">
          <TextField
            label="Mercado"
            value={market}
            onChangeText={onMarketChange}
            placeholder="Comercio"
            size="md"
          />
        </View>
      </View>

      <CategorySelect value={category} onChange={onCategoryChange} />

      <View className="gap-3 sm:flex-row">
        <View className="min-w-0 flex-1">
          <BrutalButton
            label="Vincular producto"
            icon="add"
            fullWidth
            onPress={onManualSubmit}
          />
        </View>
        <View className="min-w-0 flex-1">
          <BrutalButton
            label="Elegir factura"
            icon="receipt-long"
            variant="secondary"
            fullWidth
            onPress={onOpenManualFlow}
          />
        </View>
      </View>
    </View>
  );
}