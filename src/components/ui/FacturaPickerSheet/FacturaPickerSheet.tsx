import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetScrollView,
	BottomSheetView,
	type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { MaterialIcons } from "@expo/vector-icons";
import { useCallback, useMemo, type RefObject } from "react";
import { Pressable, Text, View } from "react-native";

import colors from "@/constants/colors";
import { Factura } from "@/domain/factura/factura.types";

interface FacturaPickerSheetProps {
	bottomSheetModalRef: RefObject<BottomSheetModal | null>;
	facturas: Factura[];
	facturaSeleccionadaId: string | null;
	onClose: () => void;
	onSelect: (factura: Factura) => void;
}

export default function FacturaPickerSheet({
	bottomSheetModalRef,
	facturas,
	facturaSeleccionadaId,
	onClose,
	onSelect,
}: FacturaPickerSheetProps) {
	const snapPoints = useMemo(() => ["55%", "90%"], []);
	const renderBackdrop = useCallback(
		(props: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop
				{...props}
				appearsOnIndex={0}
				disappearsOnIndex={-1}
				opacity={0.5}
				pressBehavior="close"
			/>
		),
		[],
	);

	return (
		<BottomSheetModal
			ref={bottomSheetModalRef}
			index={0}
			snapPoints={snapPoints}
			enableDynamicSizing={false}
			enablePanDownToClose
			backdropComponent={renderBackdrop}
			backgroundStyle={{
				backgroundColor: colors.base.white,
				borderColor: colors.base.black,
				borderTopLeftRadius: 28,
				borderTopRightRadius: 28,
				borderWidth: 3,
			}}
			handleIndicatorStyle={{
				backgroundColor: colors.primary.v3,
				height: 6,
				width: 48,
			}}
		>
			<BottomSheetView style={{ flex: 1, paddingHorizontal: 20 }}>
				<View className="w-full flex-row items-center justify-between gap-3 pb-4">
					<Text className="min-w-0 flex-1 font-mono-bold text-2xl leading-[32px] text-base-black">
						Últimas facturas
					</Text>
					<Pressable
						accessibilityRole="button"
						accessibilityLabel="Cerrar últimas facturas"
						onPress={onClose}
						className="h-[42px] w-[42px] items-center justify-center border-[3px] border-base-black bg-base-white shadow-[4px_4px_1px_black]"
					>
						<MaterialIcons
							name="close"
							size={22}
							color={colors.base.black}
						/>
					</Pressable>
				</View>

				<BottomSheetScrollView
					style={{ flex: 1 }}
					contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
				>
					{facturas.map((factura) => {
						const selected = factura.id === facturaSeleccionadaId;

						return (
							<Pressable
								key={factura.id}
								accessibilityRole="button"
								accessibilityState={{ selected }}
								onPress={() => onSelect(factura)}
								className={`gap-1 border-[3px] border-base-black p-3 ${
									selected ? "bg-primary-v1" : "bg-base-white"
								}`}
							>
								<Text
									numberOfLines={1}
									className={`font-mono-bold text-base leading-5 ${
										selected ? "text-base-white" : "text-base-black"
									}`}
								>
									{factura.displayName}
								</Text>
								<Text
									numberOfLines={1}
									className={`font-mono text-xs leading-[15px] ${
										selected ? "text-base-white" : "text-secondary-v2"
									}`}
								>
									{factura.status} · {factura.products.length} productos
								</Text>
							</Pressable>
						);
					})}
				</BottomSheetScrollView>
			</BottomSheetView>
		</BottomSheetModal>
	);
}