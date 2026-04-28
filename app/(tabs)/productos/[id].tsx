import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AhorroIndicator from "@/assets/images/Property 1=ahorro.svg";
import ObligacionIndicator from "@/assets/images/Property 1=obligacion.svg";
import OcioIndicator from "@/assets/images/Property 1=ocio.svg";
import { demoProducts } from "@/assets/data/productData";
import Header from "@/components/layout/Header/Header";
import colors from "@/constants/colors";
import { ProductCategory, Producto } from "@/domain/product/product.types";

const CATEGORY_LABELS: Record<ProductCategory, string> = {
	obligacion: "Obligación",
	ahorro: "Ahorro",
	ocio: "Ocio",
};

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
	month: "long",
	year: "numeric",
});

function formatPrice(price: Producto["price"]) {
	return currencyFormatter.format(price);
}

function formatProductDate(date: Producto["date"]) {
	return dateFormatter.format(new Date(`${date}T00:00:00`));
}

function CategoryIndicator({ category }: { category: ProductCategory }) {
	const Indicator = indicatorByCategory[category];

	return (
		<Indicator
			width={88}
			height={76}
		/>
	);
}

function BackButton({ label = "Volver" }: { label?: string }) {
	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel={label}
			onPress={() => router.back()}
			className="h-[46px] flex-row items-center gap-2 self-start border-[3px] border-base-black bg-base-white px-[14px] py-[10px] shadow-[4px_4px_1px_black]">
			<MaterialIcons
				name="arrow-back"
				size={24}
				color={colors.base.black}
			/>
			<Text className="font-mono-bold text-xs leading-4 text-base-black">
				{label}
			</Text>
		</Pressable>
	);
}

function DetailRow({ label, value }: { label: string; value: string }) {
	return (
		<View className="gap-1 border-b-[3px] border-base-black pb-3">
			<Text className="font-mono text-xs uppercase leading-[15px] text-secondary-v2">
				{label}
			</Text>
			<Text className="font-mono-bold text-xl leading-[26px] text-base-black">
				{value}
			</Text>
		</View>
	);
}

function ProductNotFound() {
	return (
		<SafeAreaView className="flex-1 bg-base-white">
			<Header />
			<View className="flex-1 justify-center gap-6 px-4">
				<BackButton />
				<View className="gap-4 border-[3px] border-base-black bg-base-white p-5 shadow-[4px_4px_1px_black]">
					<Text className="font-mono-bold text-3xl leading-[38px] text-base-black">
						Producto no encontrado
					</Text>
					<Text className="font-mono text-base leading-5 text-secondary-v2">
						No hay ningún producto con ese identificador.
					</Text>
				</View>
			</View>
		</SafeAreaView>
	);
}

export default function ProductDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const productId = Array.isArray(id) ? id[0] : id;
	const product = demoProducts.find((item) => item.id === productId);

	if (!product) return <ProductNotFound />;

	return (
		<SafeAreaView className="flex-1 bg-base-white">
			<Header />

			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				alwaysBounceVertical
				contentInsetAdjustmentBehavior="automatic">
				<View className="gap-6 px-4 pb-8 pt-4">
					<BackButton />

					<View className="gap-6 border-[3px] border-base-black bg-base-white p-5 shadow-[4px_4px_1px_black]">
						<View className="flex-row items-start justify-between gap-4">
							<View className="min-w-0 flex-1 gap-2">
								<Text
									numberOfLines={1}
									className="font-mono text-base leading-5 text-secondary-v2">
									{product.brand}
								</Text>
								<Text className="font-mono-bold text-4xl leading-[48px] text-base-black">
									{product.name}
								</Text>
							</View>
							<CategoryIndicator category={product.category} />
						</View>

						<View className="border-[3px] border-base-black bg-primary-v1 p-4">
							<Text className="font-mono text-xs uppercase leading-[15px] text-base-white">
								Precio
							</Text>
							<Text
								numberOfLines={1}
								adjustsFontSizeToFit
								className="font-mono-bold text-5xl leading-[58px] text-base-white">
								{formatPrice(product.price)}
							</Text>
						</View>

						<View className="gap-4">
							<DetailRow
								label="Categoría"
								value={CATEGORY_LABELS[product.category]}
							/>
							<DetailRow
								label="Fecha"
								value={formatProductDate(product.date)}
							/>
							<DetailRow
								label="Identificador"
								value={product.id}
							/>
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
