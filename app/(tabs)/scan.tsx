import { MaterialIcons } from "@expo/vector-icons";
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetScrollView,
	BottomSheetView,
	type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { router, useFocusEffect } from "expo-router";
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	type RefObject,
} from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/layout/Header/Header";
import TextField from "@/components/ui/FormInput/FormInput";
import colors from "@/constants/colors";
import {
	BASE_PRODUCT_CATEGORIES,
	DEFAULT_PRODUCT_CATEGORY,
	ProductCategory,
	ProductCategoryOption,
} from "@/domain/category/category.types";
import { Factura, FacturaUploadStatus } from "@/domain/factura/factura.types";
import {
	agregarProductoManualAFactura,
	listarFacturas,
	subirFacturaMock,
} from "@/services/facturas";
import { listarCategorias } from "@/services/categories";

type ScanTab = "photo" | "manual";

const statusLabels: Record<
	Exclude<FacturaUploadStatus, "idle" | "uploading">,
	{ title: string; detail: string; color: string }
> = {
	success: {
		title: "Factura subida",
		detail: "Se enviará una notificación cuando esté lista para revisar.",
		color: colors.feedback.success.v1,
	},
	not_complete: {
		title: "Factura incompleta",
		detail: "Revisa los campos no detectados o introdúcelos manualmente.",
		color: colors.feedback.warning.v1,
	},
	error: {
		title: "Error al procesar",
		detail: "Puedes reintentar la subida o vincular un producto manualmente.",
		color: colors.feedback.danger.v1,
	},
};

function BrutalButton({
	label,
	icon,
	variant = "primary",
	fullWidth,
	disabled,
	onPress,
}: {
	label: string;
	icon?: keyof typeof MaterialIcons.glyphMap;
	variant?: "primary" | "secondary" | "danger";
	fullWidth?: boolean;
	disabled?: boolean;
	onPress: () => void;
}) {
	const backgroundColor =
		variant === "primary"
			? colors.primary.v1
			: variant === "danger"
				? colors.feedback.danger.v1
				: colors.base.white;
	const textColor = variant === "secondary" ? colors.base.black : colors.base.white;

	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel={label}
			disabled={disabled}
			onPress={onPress}
			style={{
				alignItems: "center",
				backgroundColor,
				borderColor: colors.base.black,
				borderWidth: 3,
				flexDirection: "row",
				gap: 8,
				opacity: disabled ? 0.5 : 1,
				paddingHorizontal: 19,
				paddingVertical: 11,
				shadowColor: colors.base.black,
				shadowOffset: { width: 4, height: 4 },
				shadowOpacity: 1,
				shadowRadius: 1,
				width: fullWidth ? "100%" : undefined,
				elevation: 5,
			}}>
			{icon ? (
				<MaterialIcons
					name={icon}
					size={20}
					color={textColor}
				/>
			) : null}
			<Text
				numberOfLines={1}
				style={{
					color: textColor,
					fontFamily: "RedHatMono_700Bold",
					fontSize: 12,
					lineHeight: 16,
					textAlign: "center",
				}}>
				{label}
			</Text>
		</Pressable>
	);
}

function BrowserTabs({
	activeTab,
	onTabChange,
}: {
	activeTab: ScanTab;
	onTabChange: (tab: ScanTab) => void;
}) {
	const tabs: { key: ScanTab; label: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
		{ key: "photo", label: "Foto", icon: "photo-camera" },
		{ key: "manual", label: "Manual", icon: "edit" },
	];

	return (
		<View className="w-full flex-row items-end">
			{tabs.map((tab) => {
				const active = tab.key === activeTab;

				return (
					<Pressable
						key={tab.key}
						accessibilityRole="tab"
						accessibilityState={{ selected: active }}
						onPress={() => onTabChange(tab.key)}
						className={`min-h-[52px] flex-1 flex-row items-center justify-center gap-2 border-[3px] border-base-black px-3 py-3 ${
							active ? "bg-primary-v1" : "bg-base-white"
						}`}
						style={{
							borderBottomWidth: active ? 0 : 3,
							shadowColor: active ? colors.base.black : "transparent",
							shadowOffset: { width: 4, height: 4 },
							shadowOpacity: active ? 1 : 0,
							shadowRadius: 1,
							elevation: active ? 5 : 0,
							zIndex: active ? 2 : 1,
						}}>
						<MaterialIcons
							name={tab.icon}
							size={22}
							color={active ? colors.base.white : colors.primary.v1}
						/>
						<Text
							numberOfLines={1}
							adjustsFontSizeToFit
							className={`font-mono-bold text-xs leading-[15px] uppercase ${
								active ? "text-base-white" : "text-primary-v1"
							}`}>
							{tab.label}
						</Text>
					</Pressable>
				);
			})}
		</View>
	);
}

function ScanCaptureButton({
	status,
	onCapture,
}: {
	status: FacturaUploadStatus;
	onCapture: () => void;
}) {
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
			}}>
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
				}}>
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

function FacturaPreviewModal({
	visible,
	uploading,
	onUpload,
	onRetake,
}: {
	visible: boolean;
	uploading: boolean;
	onUpload: () => void;
	onRetake: () => void;
}) {
	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onRetake}>
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
							className="h-[42px] w-[42px] items-center justify-center border-[3px] border-base-black bg-base-white shadow-[4px_4px_1px_black]">
							<MaterialIcons
								name="close"
								size={22}
								color={colors.base.black}
							/>
						</Pressable>
					</View>

					<View className="h-[360px] w-full items-center justify-center border-[3px] border-base-black bg-primary-v4">
						<View className="h-[292px] w-[210px] gap-4 border-[3px] border-base-black bg-base-white p-4">
							<View className="h-4 w-28 bg-primary-v1" />
							<View className="h-3 w-full bg-secondary-v3" />
							<View className="h-3 w-4/5 bg-secondary-v3" />
							<View className="h-24 w-full border-[3px] border-base-black bg-base-white" />
							<View className="h-3 w-full bg-secondary-v3" />
							<View className="h-3 w-3/4 bg-secondary-v3" />
							<View className="mt-auto h-8 w-full bg-primary-v1" />
						</View>
					</View>

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

function ManualEntryPanel({
	selectedFactura,
	categories,
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
}: {
	selectedFactura: Factura | null;
	categories: ProductCategoryOption[];
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
}) {
	return (
		<View className="gap-5 border-[3px] border-base-black bg-base-white p-4 shadow-[4px_4px_1px_black]">

			{selectedFactura ? (
				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Cambiar factura seleccionada"
					onPress={onOpenManualFlow}
					className="flex-row items-center justify-between gap-3 border-[3px] border-base-black bg-primary-v4 p-3">
					<View className="min-w-0 flex-1">
						<Text
							numberOfLines={1}
							className="font-mono text-xs leading-[15px] text-secondary-v2">
							Factura seleccionada
						</Text>
						<Text
							numberOfLines={1}
							className="font-mono-bold text-base leading-5 text-base-black">
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

			<CategorySelect
				categories={categories}
				value={category}
				onChange={onCategoryChange}
			/>

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

function CategorySelect({
	categories,
	value,
	onChange,
}: {
	categories: ProductCategoryOption[];
	value: ProductCategory;
	onChange: (value: ProductCategory) => void;
}) {
	return (
		<View className="gap-[5px]">
			<Text className="font-mono text-base leading-5 text-base-black">
				Categoria
			</Text>
			<View className="flex-row flex-wrap gap-2">
				{categories.map((option) => {
					const active = option.id === value;

					return (
						<Pressable
							key={option.id}
							accessibilityRole="button"
							accessibilityState={{ selected: active }}
							onPress={() => onChange(option.id)}
							className={`min-h-[42px] min-w-[96px] flex-1 items-center justify-center border-[4px] border-base-black px-2 py-2 ${
								active ? "bg-primary-v1" : "bg-base-white"
							}`}>
							<Text
								numberOfLines={1}
								adjustsFontSizeToFit
								className={`font-mono text-xs leading-[15px] ${
									active ? "text-base-white" : "text-secondary-v3"
								}`}>
								{option.label}
							</Text>
						</Pressable>
					);
				})}
			</View>
		</View>
	);
}

function StatusCard({
	status,
	facturaId,
	errorMessage,
	onManualPress,
}: {
	status: Exclude<FacturaUploadStatus, "idle" | "uploading">;
	facturaId: string | null;
	errorMessage?: string;
	onManualPress: () => void;
}) {
	const statusInfo = statusLabels[status];

	return (
		<View className="gap-3 border-[3px] border-base-black bg-base-white p-4 shadow-[4px_4px_1px_black]">
			<View className="flex-row items-start gap-3">
				<MaterialIcons
					name={
						status === "success"
							? "check-circle"
							: status === "not_complete"
								? "error-outline"
								: "cancel"
					}
					size={26}
					color={statusInfo.color}
				/>
				<View className="min-w-0 flex-1 gap-1">
					<Text className="font-mono-bold text-xl leading-[26px] text-base-black">
						{statusInfo.title}
					</Text>
					<Text className="font-mono text-sm leading-[18px] text-secondary-v2">
						{errorMessage ?? statusInfo.detail}
					</Text>
				</View>
			</View>

			<View className="flex-row flex-wrap gap-3">
				{facturaId ? (
					<BrutalButton
						label="Ver detalle"
						icon="receipt-long"
						onPress={() => router.push(`/facturas/${facturaId}`)}
					/>
				) : null}
				{status !== "success" ? (
					<BrutalButton
						label="Introducir manualmente"
						icon="edit"
						variant="secondary"
						onPress={onManualPress}
					/>
				) : null}
			</View>
		</View>
	);
}

function FacturaPickerSheet({
	bottomSheetModalRef,
	facturas,
	facturaSeleccionadaId,
	onClose,
	onSelect,
}: {
	bottomSheetModalRef: RefObject<BottomSheetModal | null>;
	facturas: Factura[];
	facturaSeleccionadaId: string | null;
	onClose: () => void;
	onSelect: (factura: Factura) => void;
}) {
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
			}}>
			<BottomSheetView style={{ flex: 1, paddingHorizontal: 20 }}>
				<View className="w-full flex-row items-center justify-between gap-3 pb-4">
					<Text className="min-w-0 flex-1 font-mono-bold text-2xl leading-[32px] text-base-black">
						Últimas facturas
					</Text>
					<Pressable
						accessibilityRole="button"
						accessibilityLabel="Cerrar últimas facturas"
						onPress={onClose}
						className="h-[42px] w-[42px] items-center justify-center border-[3px] border-base-black bg-base-white shadow-[4px_4px_1px_black]">
						<MaterialIcons
							name="close"
							size={22}
							color={colors.base.black}
						/>
					</Pressable>
				</View>

				<BottomSheetScrollView
					style={{ flex: 1 }}
					contentContainerStyle={{ gap: 12, paddingBottom: 24 }}>
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
								}`}>
								<Text
									numberOfLines={1}
									className={`font-mono-bold text-base leading-5 ${
										selected ? "text-base-white" : "text-base-black"
									}`}>
									{factura.displayName}
								</Text>
								<Text
									numberOfLines={1}
									className={`font-mono text-xs leading-[15px] ${
										selected ? "text-base-white" : "text-secondary-v2"
									}`}>
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

export default function ScanScreen() {
	const [uploadStatus, setUploadStatus] = useState<FacturaUploadStatus>("idle");
	const [ultimaFacturaId, setLastFacturaId] = useState<string | null>(null);
	const [statusError, setStatusError] = useState<string | undefined>();
	const [facturas, setFacturas] = useState<Factura[]>([]);
	const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
	const [categories, setCategories] = useState<ProductCategoryOption[]>(
		BASE_PRODUCT_CATEGORIES,
	);
	const [name, setName] = useState("");
	const [category, setCategory] = useState<ProductCategory>(
		DEFAULT_PRODUCT_CATEGORY,
	);
	const [amount, setAmount] = useState("");
	const [market, setMarket] = useState("");
	const [isPreviewVisible, setIsPreviewVisible] = useState(false);
	const [activeTab, setActiveTab] = useState<ScanTab>("photo");
	const facturaPickerRef = useRef<BottomSheetModal>(null);

	useEffect(() => {
		listarFacturas(5).then((nextFacturas) => {
			setFacturas(nextFacturas);
			setSelectedFactura((currentFactura) => currentFactura ?? nextFacturas[0] ?? null);
		});
	}, []);

	useFocusEffect(
		useCallback(() => {
			let isActive = true;

			listarCategorias().then((nextCategories) => {
				if (!isActive) return;

				setCategories(nextCategories);
				setCategory((currentCategory) => {
					if (
						nextCategories.some(
							(nextCategory) => nextCategory.id === currentCategory,
						)
					) {
						return currentCategory;
					}

					return DEFAULT_PRODUCT_CATEGORY;
				});
			});

			return () => {
				isActive = false;
			};
		}, []),
	);

	function handleOpenManualFlow() {
		facturaPickerRef.current?.present();
	}

	function handleCloseManualFlow() {
		facturaPickerRef.current?.dismiss();
	}

	function handleSelectFactura(factura: Factura) {
		setSelectedFactura(factura);
		handleCloseManualFlow();
	}

	function handleCaptureFactura() {
		setIsPreviewVisible(true);
	}

	function handleRetakeFactura() {
		if (uploadStatus !== "uploading") setIsPreviewVisible(false);
	}

	async function handleUploadFactura() {
		setUploadStatus("uploading");
		setStatusError(undefined);

		const result = await subirFacturaMock();
		setUploadStatus(result.status);
		setLastFacturaId(result.facturaId ?? null);
		setStatusError(result.errorMessage);
		setIsPreviewVisible(false);

		const nextFacturas = await listarFacturas(5);
		setFacturas(nextFacturas);
		if (result.facturaId) {
			const uploadedFactura = nextFacturas.find(
				(factura) => factura.id === result.facturaId,
			);
			setSelectedFactura(uploadedFactura ?? nextFacturas[0] ?? null);
		}
	}

	async function handleManualSubmit() {
		const parsedAmount = Number(amount.trim().replace(",", "."));

		if (!selectedFactura || !name.trim() || !market.trim() || !Number.isFinite(parsedAmount)) {
			setUploadStatus("error");
			setStatusError("Selecciona una factura y completa todos los campos.");
			handleOpenManualFlow();
			return;
		}

		const updatedFactura = await agregarProductoManualAFactura(selectedFactura.id, {
			name: name.trim(),
			category,
			amount: parsedAmount,
			market: market.trim(),
		});

		if (!updatedFactura) {
			setUploadStatus("error");
			setStatusError("No se pudo vincular el producto a la factura.");
			return;
		}

		setSelectedFactura(updatedFactura);
		setLastFacturaId(updatedFactura.id);
		setUploadStatus("success");
		setStatusError(undefined);
		setName("");
		setAmount("");
		setMarket("");
		setFacturas(await listarFacturas(5));
	}

	const completedUploadStatus =
		uploadStatus === "success" ||
		uploadStatus === "not_complete" ||
		uploadStatus === "error"
			? uploadStatus
			: null;

	return (
		<SafeAreaView className="flex-1 bg-base-white">
			<Header />

			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				alwaysBounceVertical
				contentInsetAdjustmentBehavior="automatic">
				<View className="gap-4 px-4 pb-36 pt-4">
					<Text className="font-mono-bold text-4xl leading-[48px] text-base-black">
						scan
					</Text>

					<BrowserTabs
						activeTab={activeTab}
						onTabChange={setActiveTab}
					/>

					<View className="-mt-4 border-[3px] border-base-black bg-base-white p-4 shadow-[4px_4px_1px_black]">
						{activeTab === "photo" ? (
							<View className="gap-4">
								<ScanCaptureButton
									status={uploadStatus}
									onCapture={handleCaptureFactura}
								/>

								{completedUploadStatus ? (
									<StatusCard
										status={completedUploadStatus}
										facturaId={ultimaFacturaId}
										errorMessage={statusError}
										onManualPress={() => {
											setActiveTab("manual");
											handleOpenManualFlow();
										}}
									/>
								) : null}
							</View>
						) : (
							<ManualEntryPanel
								selectedFactura={selectedFactura}
								categories={categories}
								name={name}
								category={category}
								amount={amount}
								market={market}
								onNameChange={setName}
								onCategoryChange={setCategory}
								onAmountChange={setAmount}
								onMarketChange={setMarket}
								onOpenManualFlow={handleOpenManualFlow}
								onManualSubmit={handleManualSubmit}
							/>
						)}
					</View>

					{activeTab === "photo" && selectedFactura ? (
						<Pressable
							accessibilityRole="button"
							accessibilityLabel="Abrir entrada manual"
							onPress={() => setActiveTab("manual")}
							className="flex-row items-center justify-between gap-3 border-[3px] border-base-black bg-base-white p-3 shadow-[4px_4px_1px_black]">
							<View className="min-w-0 flex-1">
								<Text className="font-mono-bold text-base leading-5 text-base-black">
									Entrada manual
								</Text>
								<Text
									numberOfLines={1}
									className="font-mono text-xs leading-[15px] text-secondary-v2">
									Vincula productos a {selectedFactura.displayName}
								</Text>
							</View>
							<MaterialIcons
								name="arrow-forward"
								size={24}
								color={colors.primary.v1}
							/>
						</Pressable>
					) : null}
				</View>
			</ScrollView>

			<FacturaPreviewModal
				visible={isPreviewVisible}
				uploading={uploadStatus === "uploading"}
				onUpload={handleUploadFactura}
				onRetake={handleRetakeFactura}
			/>

			<FacturaPickerSheet
				bottomSheetModalRef={facturaPickerRef}
				facturas={facturas}
				facturaSeleccionadaId={selectedFactura?.id ?? null}
				onClose={handleCloseManualFlow}
				onSelect={handleSelectFactura}
			/>
		</SafeAreaView>
	);
}
