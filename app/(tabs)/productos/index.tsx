import { MaterialIcons } from "@expo/vector-icons";
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	BottomSheetScrollView,
	BottomSheetTextInput,
	BottomSheetView,
	type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	type RefObject,
} from "react";
import {
	Image,
	Keyboard,
	Modal,
	Pressable,
	ScrollView,
	Text,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { transactionListToProductoList } from "@/mappers/transaction.mapper";
import { listarTransacciones } from "@/services/transactions";
import AhorroIndicator from "@/assets/images/Property 1=ahorro.svg";
import ObligacionIndicator from "@/assets/images/Property 1=obligacion.svg";
import OcioIndicator from "@/assets/images/Property 1=ocio.svg";
import TitleDecorator from "@/assets/images/Vector(1).svg";
import Header from "@/components/layout/Header/Header";
import TextField from "@/components/ui/FormInput/FormInput";
import colors from "@/constants/colors";
import {
	BaseProductCategory,
	isBaseProductCategory,
} from "@/domain/category/category.types";
import { ProductCategory, Producto } from "@/domain/product/product.types";

type StatStatus = "success" | "warning" | "danger";

type StatSummary = {
	label: string;
	current: string;
	target: string;
	status: StatStatus;
};

type ProductosData = {
	filters: ProductFilter[];
	stats: [StatSummary, StatSummary, StatSummary];
};

type ProductFilter = "todos" | BaseProductCategory;
type ExtraFilters = {
	selectedBrands: string[];
	minPrice: string;
	maxPrice: string;
};

const CATEGORY_LABELS: Record<BaseProductCategory, string> = {
	obligacion: "Obligaciones",
	ahorro: "Ahorros",
	ocio: "Ocio",
};

const FILTER_LABELS: Record<ProductFilter, string> = {
	todos: "Todos",
	...CATEGORY_LABELS,
};

const FILTERS: ProductFilter[] = ["todos", "obligacion", "ahorro", "ocio"];
const EASTER_EGG_TAP_TARGET = 10;

const indicatorByCategory = {
	obligacion: ObligacionIndicator,
	ahorro: AhorroIndicator,
	ocio: OcioIndicator,
} as const;

const currencyFormatter = new Intl.NumberFormat("es-ES", {
	style: "currency",
	currency: "EUR",
});

const dateFormatter = new Intl.DateTimeFormat("es-ES", {
	day: "2-digit",
	month: "short",
	year: "numeric",
});

const LIST_ITEM_SHADOW_STYLE = {
	shadowColor: colors.base.black,
	shadowOffset: { width: 4, height: 4 },
	shadowOpacity: 1,
	shadowRadius: 1,
	elevation: 5,
};

const statusColors = {
	success: "text-feedback-success-v1",
	warning: "text-feedback-warning-v1",
	danger: "text-feedback-danger-v1",
} as const;

const filterIconByFilter: Record<
	ProductFilter,
	keyof typeof MaterialIcons.glyphMap
> = {
	todos: "apps",
	obligacion: "lock",
	ahorro: "savings",
	ocio: "celebration",
};

function formatPrice(price: Producto["price"]) {
	return currencyFormatter.format(price);
}

function formatProductDate(date: Producto["date"]) {
	return dateFormatter.format(new Date(`${date}T00:00:00`));
}

function getProductCategoryLabel(category: ProductCategory) {
	return isBaseProductCategory(category) ? CATEGORY_LABELS[category] : category;
}

function sortProductsByDate(products: Producto[]) {
	return [...products].sort((firstProduct, secondProduct) => {
		return Date.parse(secondProduct.date) - Date.parse(firstProduct.date);
	});
}

function sortProductsByPrice(products: Producto[]) {
	return [...products].sort((firstProduct, secondProduct) => {
		return secondProduct.price - firstProduct.price;
	});
}

function buildProductosData(products: Producto[]): ProductosData {
	const productCount = products.length;
	const totalPrice = products.reduce(
		(total, product) => total + product.price,
		0,
	);
	const averagePrice = productCount ? totalPrice / productCount : 0;
	const maxPrice = products.reduce(
		(max, product) => Math.max(max, product.price),
		0,
	);

	return {
		filters: FILTERS,
		stats: [
			{
				label: "Productos",
				current: String(productCount),
				target: "Total",
				status: "success",
			},
			{
				label: "Precio medio",
				current: formatPrice(averagePrice),
				target: "Media",
				status: "warning",
			},
			{
				label: "Más caro",
				current: formatPrice(maxPrice),
				target: "Max",
				status: "danger",
			},
		],
	};
}

function filterProductsByCategory(
	products: Producto[],
	selectedFilter: ProductFilter,
) {
	if (selectedFilter === "todos") return products;

	return products.filter((product) => product.category === selectedFilter);
}

function parsePriceFilter(value: string) {
	const normalizedValue = value.trim().replace(",", ".");

	if (!normalizedValue) return null;

	const parsedValue = Number(normalizedValue);

	return Number.isFinite(parsedValue) ? parsedValue : null;
}

function filterProductsByExtras(
	products: Producto[],
	{ selectedBrands, minPrice, maxPrice }: ExtraFilters,
) {
	const minPriceValue = parsePriceFilter(minPrice);
	const maxPriceValue = parsePriceFilter(maxPrice);

	return products.filter((product) => {
		const matchesBrand =
			selectedBrands.length === 0 || selectedBrands.includes(product.brand);
		const matchesMinPrice =
			minPriceValue === null || product.price >= minPriceValue;
		const matchesMaxPrice =
			maxPriceValue === null || product.price <= maxPriceValue;

		return matchesBrand && matchesMinPrice && matchesMaxPrice;
	});
}

function filterProductsByQuery(products: Producto[], query: string) {
	const normalizedQuery = query.trim().toLowerCase();

	if (!normalizedQuery) return products;

	return products.filter((product) =>
		[
			product.brand,
			product.name,
			formatPrice(product.price),
			product.category,
			getProductCategoryLabel(product.category),
			formatProductDate(product.date),
		]
			.join(" ")
			.toLowerCase()
			.includes(normalizedQuery),
	);
}

function getUniqueBrands(products: Producto[]) {
	return Array.from(new Set(products.map((product) => product.brand))).sort();
}

function hasExtraFilters({ selectedBrands, minPrice, maxPrice }: ExtraFilters) {
	return (
		selectedBrands.length > 0 ||
		minPrice.trim().length > 0 ||
		maxPrice.trim().length > 0
	);
}

function EmptyState() {
	return (
		<View className="items-center px-8 py-20">
			<MaterialIcons
				name="receipt-long"
				size={64}
				color={colors.secondary.v2}
			/>
			<Text className="mt-4 text-center font-mono-bold text-xl leading-7 text-base-black">
				No hay productos
			</Text>
			<Text className="mt-2 text-center font-mono text-base leading-5 text-secondary-v2">
				Escanea ya tu primer ticket
			</Text>
		</View>
	);
}

function SearchIcon() {
	return (
		<MaterialIcons
			name="search"
			size={24}
			color={colors.base.black}
		/>
	);
}

function CategoryIndicator({ category }: { category: ProductCategory }) {
	if (!isBaseProductCategory(category)) {
		return (
			<MaterialIcons
				name="category"
				size={30}
				color={colors.base.black}
			/>
		);
	}

	const Indicator = indicatorByCategory[category];

	return (
		<Indicator
			width={30}
			height={26}
		/>
	);
}

function FilterButton({
	filter,
	active,
	onPress,
}: {
	filter: ProductFilter;
	active: boolean;
	onPress: () => void;
}) {
	const iconColor = active ? colors.base.white : colors.base.black;

	return (
		<Pressable
			accessibilityRole="button"
			accessibilityState={{ selected: active }}
			onPress={onPress}
			className={`flex-row items-center gap-2 border-[3px] border-base-black px-[19px] py-[11px] shadow-[4px_4px_0px_black] ${
				active ? "bg-primary-v1" : "bg-base-white"
			}`}>
			<MaterialIcons
				name={filterIconByFilter[filter]}
				size={24}
				color={iconColor}
			/>
			<Text
				numberOfLines={1}
				className={`font-mono text-xs leading-[16px] ${
					active ? "text-base-white" : "text-base-black"
				}`}>
				{FILTER_LABELS[filter]}
			</Text>
		</Pressable>
	);
}

function ExtraFiltersButton({
	active,
	onPress,
}: {
	active: boolean;
	onPress: () => void;
}) {
	const iconColor = active ? colors.base.white : colors.base.black;

	return (
		<Pressable
			accessibilityRole="button"
			accessibilityState={{ selected: active }}
			onPress={onPress}
			className={`flex-row items-center gap-2 border-[3px] border-base-black px-[19px] py-[11px] shadow-[4px_4px_0px_black] ${
				active ? "bg-primary-v1" : "bg-base-white"
			}`}>
			<MaterialIcons
				name="tune"
				size={24}
				color={iconColor}
			/>
			<Text
				numberOfLines={1}
				className={`font-mono text-xs leading-[16px] ${
					active ? "text-base-white" : "text-base-black"
				}`}>
				Filtros extra
			</Text>
		</Pressable>
	);
}

function BrandChip({
	brand,
	selected,
	onPress,
}: {
	brand: string;
	selected: boolean;
	onPress: () => void;
}) {
	return (
		<Pressable
			accessibilityRole="button"
			accessibilityState={{ selected }}
			onPress={onPress}
			className={`border-[3px] border-base-black px-3 py-2 ${
				selected ? "bg-primary-v1" : "bg-base-white"
			}`}>
			<Text
				numberOfLines={1}
				className={`font-mono text-xs leading-[15px] ${
					selected ? "text-base-white" : "text-base-black"
				}`}>
				{brand}
			</Text>
		</Pressable>
	);
}

function SheetButton({
	label,
	icon,
	variant,
	onPress,
}: {
	label: string;
	icon: keyof typeof MaterialIcons.glyphMap;
	variant: "primary" | "secondary";
	onPress: () => void;
}) {
	const isPrimary = variant === "primary";

	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel={label}
			onPress={onPress}
			className={`h-[46px] flex-1 flex-row items-center justify-center gap-2 border-[3px] border-base-black px-[14px] py-[10px] shadow-[4px_4px_1px_black] ${
				isPrimary ? "bg-primary-v1" : "bg-base-white"
			}`}>
			<MaterialIcons
				name={icon}
				size={22}
				color={isPrimary ? colors.base.white : colors.base.black}
			/>
			<Text
				numberOfLines={1}
				className={`font-mono-bold text-xs leading-4 ${
					isPrimary ? "text-base-white" : "text-base-black"
				}`}>
				{label}
			</Text>
		</Pressable>
	);
}

function SheetPriceInput({
	label,
	value,
	onChangeText,
	placeholder,
}: {
	label: string;
	value: string;
	onChangeText: (value: string) => void;
	placeholder: string;
}) {
	return (
		<View
			className="items-start"
			style={{ gap: 5 }}>
			<Text className="font-mono text-sm text-base-black">{label}</Text>
			<View
				className="w-full border-base-black"
				style={{
					borderWidth: 3,
					paddingHorizontal: 12,
					paddingVertical: 8,
				}}>
				<BottomSheetTextInput
					value={value}
					onChangeText={onChangeText}
					placeholder={placeholder}
					placeholderTextColor={colors.secondary.v3}
					keyboardType="numeric"
					style={{
						color: colors.base.black,
						fontFamily: "RedHatMono_400Regular",
						fontSize: 14,
						lineHeight: 14,
						margin: 0,
						padding: 0,
					}}
				/>
			</View>
		</View>
	);
}

function ExtraFiltersSheet({
	brands,
	bottomSheetModalRef,
	filters,
	onApply,
	onClose,
	onClear,
	onMaxPriceChange,
	onMinPriceChange,
	onToggleBrand,
}: {
	brands: string[];
	bottomSheetModalRef: RefObject<BottomSheetModal | null>;
	filters: ExtraFilters;
	onApply: () => void;
	onClose: () => void;
	onClear: () => void;
	onMaxPriceChange: (value: string) => void;
	onMinPriceChange: (value: string) => void;
	onToggleBrand: (brand: string) => void;
}) {
	const snapPoints = useMemo(() => ["50%", "90%"], []);
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

	useEffect(() => {
		const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
			bottomSheetModalRef.current?.snapToIndex(1);
		});
		const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
			bottomSheetModalRef.current?.snapToIndex(0);
		});

		return () => {
			showSubscription.remove();
			hideSubscription.remove();
		};
	}, [bottomSheetModalRef]);

	return (
		<BottomSheetModal
			ref={bottomSheetModalRef}
			index={0}
			snapPoints={snapPoints}
			enableDynamicSizing={false}
			enablePanDownToClose
			keyboardBehavior="interactive"
			keyboardBlurBehavior="restore"
			android_keyboardInputMode="adjustResize"
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
					<Text
						numberOfLines={1}
						adjustsFontSizeToFit
						className="min-w-0 flex-1 font-mono-bold text-2xl leading-[32px] text-base-black">
						Filtros extra
					</Text>
					<Pressable
						accessibilityRole="button"
						accessibilityLabel="Cerrar filtros extra"
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
					contentContainerStyle={{
						gap: 20,
						paddingBottom: 20,
					}}>
					<View className="gap-3">
						<Text className="font-mono-bold text-base leading-5 text-base-black">
							Empresas
						</Text>
						<View className="flex-row flex-wrap gap-3">
							{brands.map((brand) => (
								<BrandChip
									key={brand}
									brand={brand}
									selected={filters.selectedBrands.includes(brand)}
									onPress={() => onToggleBrand(brand)}
								/>
							))}
						</View>
					</View>

					<View className="gap-3">
						<Text className="font-mono-bold text-base leading-5 text-base-black">
							Rango de precio
						</Text>
						<View className="flex-row gap-3">
							<View className="min-w-0 flex-1">
								<SheetPriceInput
									label="Mínimo"
									value={filters.minPrice}
									onChangeText={onMinPriceChange}
									placeholder="0"
								/>
							</View>
							<View className="min-w-0 flex-1">
								<SheetPriceInput
									label="Máximo"
									value={filters.maxPrice}
									onChangeText={onMaxPriceChange}
									placeholder="2000"
								/>
							</View>
						</View>
					</View>
				</BottomSheetScrollView>

				<View className="flex-row gap-3 border-t-[3px] border-base-black bg-base-white py-4">
					<SheetButton
						label="Limpiar"
						icon="delete-outline"
						variant="secondary"
						onPress={onClear}
					/>
					<SheetButton
						label="Aplicar"
						icon="check"
						variant="primary"
						onPress={onApply}
					/>
				</View>
			</BottomSheetView>
		</BottomSheetModal>
	);
}

function EasterEggModal({
	visible,
	onClose,
}: {
	visible: boolean;
	onClose: () => void;
}) {
	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onClose}>
			<View className="flex-1 items-center justify-center bg-base-black/70 px-5">
				<View className="w-full max-w-[360px] gap-4 border-[3px] border-base-black bg-base-white p-4 shadow-[4px_4px_1px_black]">
					<View className="flex-row items-center justify-between gap-3">
						<Text className="min-w-0 flex-1 font-mono-bold text-2xl leading-[32px] text-base-black">
							Calma pequeñx...
						</Text>
						<Pressable
							accessibilityRole="button"
							accessibilityLabel="Cerrar easter egg"
							onPress={onClose}
							className="h-[42px] w-[42px] items-center justify-center border-[3px] border-base-black bg-base-white shadow-[4px_4px_1px_black]">
							<MaterialIcons
								name="close"
								size={22}
								color={colors.base.black}
							/>
						</Pressable>
					</View>

					<Image
						source={require("@/assets/images/marcos_waifu2x_art_noise1_scale.png")}
						resizeMode="cover"
						className="h-[360px] w-full border-[3px] border-base-black bg-secondary-v3"
					/>

					<Pressable
						accessibilityRole="button"
						accessibilityLabel="Cerrar easter egg"
						onPress={onClose}
						className="h-[46px] flex-row items-center justify-center gap-2 border-[3px] border-base-black bg-primary-v1 px-[14px] py-[10px] shadow-[4px_4px_1px_black]">
						<MaterialIcons
							name="check"
							size={22}
							color={colors.base.white}
						/>
						<Text className="font-mono-bold text-xs leading-4 text-base-white">
							Cerrar
						</Text>
					</Pressable>
				</View>
			</View>
		</Modal>
	);
}

function StatCard({ label, current, target, status }: StatSummary) {
	return (
		<View className="min-w-0 flex-1 gap-4 border-[3px] border-base-black bg-base-white p-3">
			<View className="w-full flex-row items-center justify-between gap-2">
				<Text
					numberOfLines={1}
					adjustsFontSizeToFit
					className={`min-w-0 flex-1 font-mono-bold text-2xl leading-[32px] ${statusColors[status]}`}>
					{current}
				</Text>
				<Text className="font-mono text-xl leading-[26px] text-secondary-v1">
					{target}
				</Text>
			</View>

			<Text
				numberOfLines={1}
				adjustsFontSizeToFit
				className="font-mono-bold text-2xl leading-[32px] text-primary-v1">
				{label}
			</Text>
		</View>
	);
}

function ListHeading({ title }: { title: string }) {
	return (
		<View className="w-full flex-row items-center gap-2 bg-primary-v1 px-4 py-2">
			<TitleDecorator
				width={50}
				height={26}
			/>
			<Text className="font-mono-bold text-xl leading-[26px] text-base-white">
				{title}
			</Text>
		</View>
	);
}

function ProductListItem({ product }: { product: Producto }) {
	const categoryLabel = getProductCategoryLabel(product.category);

	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel={`${product.name}, ${product.brand}`}
			onPress={() => {
				router.push({
					pathname: "/productos/[id]",
					params: { id: product.id },
				});
			}}
			className="w-full min-w-[160px] flex-row items-center justify-between border-b-[3px] border-l-[3px] border-base-black bg-base-white px-2 py-3"
			style={LIST_ITEM_SHADOW_STYLE}>
			<View className="min-w-0 flex-1 flex-row items-center gap-2">
				<View className="min-w-0 flex-1 gap-2">
					<View className="min-w-0 flex-row items-center gap-2">
						<Text
							numberOfLines={1}
							className="min-w-0 shrink font-mono text-xs leading-[15px] text-secondary-v2">
							{product.brand}
						</Text>
						<Text className="font-mono text-xs leading-[15px] text-secondary-v1">
							{formatProductDate(product.date)}
						</Text>
					</View>
					<View className="min-w-0 flex-row items-end gap-2">
						<Text
							numberOfLines={1}
							className="shrink font-mono text-base leading-5 text-base-black">
							{product.name}
						</Text>
						<Text
							numberOfLines={1}
							className="font-mono text-xs leading-[15px] text-accent2-v2">
							{formatPrice(product.price)}
						</Text>
					</View>
					<Text
						numberOfLines={1}
						className="font-mono text-xs leading-[15px] text-secondary-v2">
						{categoryLabel}
					</Text>
				</View>
			</View>
			<CategoryIndicator category={product.category} />
		</Pressable>
	);
}

function ProductListSection({
	title,
	products,
}: {
	title: string;
	products: Producto[];
}) {
	return (
		<View className="gap-[10px] px-4 pb-2 pt-1">
			<ListHeading title={title} />
			<View className="gap-[10px] px-1 pb-1 pr-2">
				{products.map((product) => (
					<ProductListItem
						key={product.id}
						product={product}
					/>
				))}
			</View>
		</View>
	);
}

export default function ProductosScreen() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedFilter, setSelectedFilter] = useState<ProductFilter>("todos");
	const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
	const [minPrice, setMinPrice] = useState("");
	const [maxPrice, setMaxPrice] = useState("");
	const [isEasterEggVisible, setIsEasterEggVisible] = useState(false);
	const [products, setProducts] = useState<Producto[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const extraFiltersSheetRef = useRef<BottomSheetModal>(null);
	const filterTapStreakRef = useRef(0);

	const realApi = !!process.env.EXPO_PUBLIC_API_BASE_URL;

	useEffect(() => {
		if (!realApi) {
			setIsLoading(false);
			return;
		}

		listarTransacciones()
			.then(transactionListToProductoList)
			.then(setProducts)
			.catch((err) => {
				console.warn("[Productos] Failed to fetch products:", err);
			})
			.finally(() => setIsLoading(false));
	}, [realApi]);

	const extraFilters = useMemo(
		() => ({ selectedBrands, minPrice, maxPrice }),
		[maxPrice, minPrice, selectedBrands],
	);

	const categoryFilteredProducts = useMemo(
		() => filterProductsByCategory(products, selectedFilter),
		[products, selectedFilter],
	);

	const extraFilteredProducts = useMemo(
		() => filterProductsByExtras(categoryFilteredProducts, extraFilters),
		[categoryFilteredProducts, extraFilters],
	);

	const searchedProducts = useMemo(
		() => filterProductsByQuery(extraFilteredProducts, searchQuery),
		[extraFilteredProducts, searchQuery],
	);

	const productosData = useMemo(
		() => buildProductosData(searchedProducts),
		[searchedProducts],
	);

	const mostExpensiveProducts = useMemo(
		() => sortProductsByPrice(searchedProducts),
		[searchedProducts],
	);

	const recentProducts = useMemo(
		() => sortProductsByDate(searchedProducts),
		[searchedProducts],
	);

	const brands = useMemo(() => getUniqueBrands(products), [products]);
	const extraFiltersActive = hasExtraFilters(extraFilters);

	function handleNotificationsPress() {}

	function handleToggleBrand(brand: string) {
		setSelectedBrands((currentBrands) => {
			if (currentBrands.includes(brand)) {
				return currentBrands.filter((currentBrand) => currentBrand !== brand);
			}

			return [...currentBrands, brand];
		});
	}

	function handleClearExtraFilters() {
		setSelectedBrands([]);
		setMinPrice("");
		setMaxPrice("");
	}

	function handleOpenExtraFilters() {
		extraFiltersSheetRef.current?.present();
	}

	function handleCloseExtraFilters() {
		extraFiltersSheetRef.current?.dismiss();
	}

	function handleFilterPress(filter: ProductFilter) {
		if (filter !== selectedFilter) {
			setSelectedFilter(filter);
			filterTapStreakRef.current = 1;
			return;
		}

		const nextStreak = filterTapStreakRef.current + 1;

		if (nextStreak >= EASTER_EGG_TAP_TARGET) {
			filterTapStreakRef.current = 0;
			setIsEasterEggVisible(true);
			return;
		}

		filterTapStreakRef.current = nextStreak;
	}

	function handleCloseEasterEgg() {
		setIsEasterEggVisible(false);
	}

	return (
		<SafeAreaView className="flex-1 bg-base-white">
			<Header onNotificationsPress={handleNotificationsPress} />

			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				alwaysBounceVertical
				contentInsetAdjustmentBehavior="automatic">
				<View className="gap-4 pb-5 pt-4">
					<View className="px-3">
						<Text className="font-mono-bold text-4xl leading-[48px] text-base-black">
							Productos
						</Text>
					</View>

					<View className="w-full gap-4 bg-base-white p-3">
						<TextField
							label=""
							state="withIcon"
							size="lg"
							icon={<SearchIcon />}
							value={searchQuery}
							onChangeText={setSearchQuery}
							placeholder="Buscador ...."
						/>

						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}>
							<View className="flex-row gap-4 p-2">
								{productosData.filters.map((filter) => (
									<FilterButton
										key={filter}
										filter={filter}
										active={selectedFilter === filter}
										onPress={() => handleFilterPress(filter)}
									/>
								))}
								<ExtraFiltersButton
									active={extraFiltersActive}
									onPress={handleOpenExtraFilters}
								/>
							</View>
						</ScrollView>

						<View className="gap-2">
							<StatCard {...productosData.stats[0]} />
							<View className="flex-row gap-2">
								<StatCard {...productosData.stats[1]} />
								<StatCard {...productosData.stats[2]} />
							</View>
						</View>
					</View>

					{!isLoading && products.length === 0 ? (
						<EmptyState />
					) : (
						<>
							<ProductListSection
								title="Lo más caro"
								products={mostExpensiveProducts}
							/>
							<ProductListSection
								title="Productos"
								products={recentProducts}
							/>
						</>
					)}
				</View>
			</ScrollView>

			<ExtraFiltersSheet
				brands={brands}
				bottomSheetModalRef={extraFiltersSheetRef}
				filters={extraFilters}
				onApply={handleCloseExtraFilters}
				onClose={handleCloseExtraFilters}
				onClear={handleClearExtraFilters}
				onMaxPriceChange={setMaxPrice}
				onMinPriceChange={setMinPrice}
				onToggleBrand={handleToggleBrand}
			/>

			<EasterEggModal
				visible={isEasterEggVisible}
				onClose={handleCloseEasterEgg}
			/>
		</SafeAreaView>
	);
}
