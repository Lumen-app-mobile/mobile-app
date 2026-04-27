import { useEffect, useMemo, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/layout/Header/Header";
import TextField from "@/components/ui/FormInput/FormInput";
import colors from "@/constants/colors";
import TitleDecorator from "../../assets/images/Vector(1).svg";

type StatStatus = "success" | "warning" | "danger";

type StatSummary = {
	label: string;
	current: string;
	target: string;
	status: StatStatus;
};

type ProductItem = {
	brand: string;
	name: string;
	price: string;
	rank?: 1 | 2 | 3;
};

type ProductosData = {
	filters: string[];
	stats: [StatSummary, StatSummary, StatSummary];
	mostExpensiveItems: ProductItem[];
	mostSoldItems: ProductItem[];
};

// Cambia solo esta URL cuando tengas el endpoint real.
// La respuesta debe tener la misma forma que FALLBACK_PRODUCTOS_DATA.
const PRODUCTOS_DATA_URL = "";

const FALLBACK_PRODUCTOS_DATA: ProductosData = {
	filters: ["Obligaciones", "Ocio", "Ahorros", "Todos"],
	stats: [
		{ label: "Obligaciones", current: "35%", target: "50%", status: "success" },
		{ label: "Ocio", current: "20%", target: "30%", status: "warning" },
		{ label: "Ahorros", current: "1%", target: "20%", status: "danger" },
	],
	mostExpensiveItems: [
		{ brand: "Apple Inc", name: "Macbook pro M5", price: "1900€" },
		{ brand: "Mercadona", name: "Ternera 500gr", price: "30€" },
		{ brand: "My investor", name: "Fondos indexados", price: "100€" },
		{ brand: "Logitech", name: "MX keyboard", price: "99€" },
		{ brand: "Logitech", name: "Ratón Logitech", price: "84€" },
	],
	mostSoldItems: [
		{ brand: "Mercadona", name: "Pollo 250gr", price: "4.56€", rank: 1 },
		{ brand: "Mercadona", name: "12 huevos frescos", price: "6€", rank: 2 },
		{ brand: "Tabacos SBD", name: "winston Picadura", price: "5,45€", rank: 3 },
	],
};

const EMPTY_PRODUCTOS_DATA: ProductosData = {
	filters: [],
	stats: FALLBACK_PRODUCTOS_DATA.stats,
	mostExpensiveItems: [],
	mostSoldItems: [],
};

const statusColors = {
	success: "text-feedback-success-v1",
	warning: "text-feedback-warning-v1",
	danger: "text-feedback-danger-v1",
} as const;

function isProductosData(data: unknown): data is ProductosData {
	if (!data || typeof data !== "object") return false;

	const candidate = data as ProductosData;

	return (
		Array.isArray(candidate.filters) &&
		Array.isArray(candidate.stats) &&
		candidate.stats.length >= 3 &&
		Array.isArray(candidate.mostExpensiveItems) &&
		Array.isArray(candidate.mostSoldItems)
	);
}

async function fetchProductosData(url: string): Promise<ProductosData> {
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`No se pudieron cargar productos: ${response.status}`);
	}

	const data: unknown = await response.json();

	if (!isProductosData(data)) {
		throw new Error("La respuesta de productos no tiene el formato esperado");
	}

	return {
		filters: data.filters,
		stats: [data.stats[0], data.stats[1], data.stats[2]],
		mostExpensiveItems: data.mostExpensiveItems,
		mostSoldItems: data.mostSoldItems,
	};
}

function filterItemsByQuery(items: ProductItem[], query: string) {
	const normalizedQuery = query.trim().toLowerCase();

	if (!normalizedQuery) return items;

	return items.filter((item) =>
		`${item.brand} ${item.name} ${item.price}`.toLowerCase().includes(normalizedQuery),
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

function FilterButton({ label }: { label: string }) {
	return (
		<Pressable
			className="flex-row items-center gap-2 border-[3px] border-base-black bg-primary-v1 px-[19px] py-[11px] shadow-[4px_4px_0px_black]">
			<MaterialIcons
				name={label === "Ocio" ? "person-outline" : "credit-card"}
				size={24}
				color={colors.base.white}
			/>
			<Text
				numberOfLines={1}
				className="font-mono text-xs leading-[16px] text-base-white">
				{label}
			</Text>
		</Pressable>
	);
}

function StatCard({ label, current, target, status }: StatSummary) {
	return (
		<View className="min-w-0 flex-1 gap-4 border-[3px] border-base-black bg-base-white p-3">
			<View className="w-full flex-row items-center justify-between">
				<Text
					className={`font-mono-bold text-2xl leading-[32px] ${statusColors[status]}`}>
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

function IndicatorTriangle() {
	return (
		<View className="h-0 w-0 border-b-[26px] border-l-[15px] border-r-[15px] border-b-category-obligacion-v2 border-l-transparent border-r-transparent" />
	);
}

function RankBadge({ rank }: { rank: 1 | 2 | 3 }) {
	return (
		<View className="h-[18px] w-[18px] items-center justify-center border-2 border-base-black bg-primary-v1">
			<Text className="font-mono-bold text-[10px] leading-3 text-base-black">
				{rank}
			</Text>
		</View>
	);
}

function ProductListItem({ brand, name, price, rank }: ProductItem) {
	return (
		<View className="w-full min-w-[160px] flex-row items-center justify-between overflow-hidden border-b-[3px] border-l-[3px] border-base-black bg-base-white px-2 py-3 shadow-[4px_4px_1px_black]">
			<View className="min-w-0 flex-1 flex-row items-center gap-2">
				{rank ? <RankBadge rank={rank} /> : null}
				<View className="min-w-0 flex-1 gap-2">
					<Text
						numberOfLines={1}
						className="font-mono text-xs leading-[15px] text-secondary-v2">
						{brand}
					</Text>
					<View className="min-w-0 flex-row items-end gap-2">
						<Text
							numberOfLines={1}
							className="shrink font-mono text-base leading-5 text-base-black">
							{name}
						</Text>
						<Text
							numberOfLines={1}
							className="font-mono text-xs leading-[15px] text-accent2-v2">
							{price}
						</Text>
					</View>
				</View>
			</View>
			<IndicatorTriangle />
		</View>
	);
}

function ProductListSection({
	title,
	items,
}: {
	title: string;
	items: ProductItem[];
}) {
	return (
		<View className="gap-[10px] px-4 py-1">
			<ListHeading title={title} />
			<View className="gap-[10px] px-1">
				{items.map((item) => (
					<ProductListItem
						key={`${item.brand}-${item.name}`}
						{...item}
					/>
				))}
			</View>
		</View>
	);
}

export default function ProductosScreen() {
	const [productosData, setProductosData] = useState<ProductosData>(
		PRODUCTOS_DATA_URL ? EMPTY_PRODUCTOS_DATA : FALLBACK_PRODUCTOS_DATA,
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [loadError, setLoadError] = useState<string | null>(null);

	useEffect(() => {
		if (!PRODUCTOS_DATA_URL) return;

		let isMounted = true;

		fetchProductosData(PRODUCTOS_DATA_URL)
			.then((data) => {
				if (!isMounted) return;

				setProductosData(data);
				setLoadError(null);
			})
			.catch((error: unknown) => {
				if (!isMounted) return;

				setProductosData(FALLBACK_PRODUCTOS_DATA);
				setLoadError(error instanceof Error ? error.message : "Error cargando productos");
			});

		return () => {
			isMounted = false;
		};
	}, []);

	const filteredMostExpensiveItems = useMemo(
		() => filterItemsByQuery(productosData.mostExpensiveItems, searchQuery),
		[productosData.mostExpensiveItems, searchQuery],
	);

	const filteredMostSoldItems = useMemo(
		() => filterItemsByQuery(productosData.mostSoldItems, searchQuery),
		[productosData.mostSoldItems, searchQuery],
	);

	function handleNotificationsPress() {}

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
						<Text
							className="font-mono-bold text-4xl leading-[48px] text-base-black">
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

						{loadError ? (
							<Text
								className="font-mono text-xs leading-[15px] text-feedback-warning-v1">
								Usando datos locales
							</Text>
						) : null}

						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}>
							<View className="flex-row gap-4 p-2">
								{productosData.filters.map((filter) => (
									<FilterButton
										key={filter}
										label={filter}
									/>
								))}
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

					<ProductListSection
						title="Lo más caro"
						items={filteredMostExpensiveItems}
					/>
					<ProductListSection
						title="Lo + vendido"
						items={filteredMostSoldItems}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
