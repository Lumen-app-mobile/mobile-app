import { MaterialIcons } from "@expo/vector-icons";
import { Stack, router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
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
import {
	crearCategoria,
	editarCategoria,
	eliminarCategoria,
	listarCategorias,
} from "@/services/categories";

type CategoryModalMode = "create" | "edit";

const ACTION_BUTTON_SHADOW = {
	shadowColor: colors.base.black,
	shadowOffset: { width: 4, height: 4 },
	shadowOpacity: 1,
	shadowRadius: 1,
	elevation: 5,
};

function IconButton({
	label,
	onPress,
}: {
	label: string;
	onPress: () => void;
}) {
	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel={label}
			onPress={onPress}
			className="h-[46px] w-[46px] items-center justify-center border-[3px] border-base-black bg-base-white"
			style={ACTION_BUTTON_SHADOW}>
			<MaterialIcons
				name="arrow-back"
				size={24}
				color={colors.base.black}
			/>
		</Pressable>
	);
}

function CategoryRow({
	category,
	selected,
	onPress,
}: {
	category: ProductCategoryOption;
	selected: boolean;
	onPress: () => void;
}) {
	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel={category.label}
			accessibilityState={{ selected }}
			onPress={onPress}
			className={`w-full min-w-[160px] flex-row items-center gap-2 border-b-[3px] border-l-[3px] px-2 py-3 ${
				selected ? "border-primary-v1 bg-primary-v4" : "border-base-black bg-base-white"
			}`}
			style={ACTION_BUTTON_SHADOW}>
			<MaterialIcons
				name={category.icon}
				size={24}
				color={colors.base.black}
			/>
			<Text
				numberOfLines={1}
				className="font-mono text-base leading-5 text-base-black">
				{category.label}
			</Text>
		</Pressable>
	);
}

function CategoryActionButton({
	label,
	variant,
	disabled,
	onPress,
}: {
	label: string;
	variant: "add" | "delete" | "edit";
	disabled?: boolean;
	onPress: () => void;
}) {
	const backgroundColor =
		variant === "add"
			? colors.category.ahorro.v1
			: variant === "delete"
				? colors.feedback.danger.v1
				: colors.primary.v1;

	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel={label}
			accessibilityState={{ disabled }}
			disabled={disabled}
			onPress={onPress}
			style={[
				ACTION_BUTTON_SHADOW,
				{
					backgroundColor,
					borderColor: colors.base.black,
					borderWidth: 3,
					opacity: disabled ? 0.45 : 1,
					paddingHorizontal: 19,
					paddingVertical: 11,
				},
			]}>
			<Text
				numberOfLines={1}
				className="font-mono text-xs leading-4 text-base-white">
				{label}
			</Text>
		</Pressable>
	);
}

function CategoryFormModal({
	mode,
	value,
	visible,
	onCancel,
	onChange,
	onSubmit,
}: {
	mode: CategoryModalMode;
	value: string;
	visible: boolean;
	onCancel: () => void;
	onChange: (value: string) => void;
	onSubmit: () => void;
}) {
	const title = mode === "create" ? "Nueva categoría" : "Editar categoría";
	const action = mode === "create" ? "Añadir" : "Guardar";

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onCancel}>
			<View className="flex-1 items-center justify-center bg-base-black/70 px-5">
				<View className="w-full max-w-[390px] gap-5 border-[3px] border-base-black bg-base-white p-4 shadow-[4px_4px_1px_black]">
					<View className="flex-row items-start justify-between gap-3">
						<Text className="min-w-0 flex-1 font-mono-bold text-2xl leading-[32px] text-base-black">
							{title}
						</Text>
						<Pressable
							accessibilityRole="button"
							accessibilityLabel="Cerrar"
							onPress={onCancel}
							className="h-[42px] w-[42px] items-center justify-center border-[3px] border-base-black bg-base-white shadow-[4px_4px_1px_black]">
							<MaterialIcons
								name="close"
								size={22}
								color={colors.base.black}
							/>
						</Pressable>
					</View>

					<TextField
						label="Nombre"
						value={value}
						onChangeText={onChange}
						placeholder="Nombre de la categoría"
						size="md"
						autoFocus
					/>

					<View className="flex-row gap-3">
						<View className="min-w-0 flex-1">
							<CategoryActionButton
								label="Cancelar"
								variant="edit"
								onPress={onCancel}
							/>
						</View>
						<View className="min-w-0 flex-1">
							<CategoryActionButton
								label={action}
								variant="add"
								disabled={!value.trim()}
								onPress={onSubmit}
							/>
						</View>
					</View>
				</View>
			</View>
		</Modal>
	);
}

export default function CategoriasConfigScreen() {
	const [categories, setCategories] = useState<ProductCategoryOption[]>(
		BASE_PRODUCT_CATEGORIES,
	);
	const [selectedCategoryId, setSelectedCategoryId] =
		useState<ProductCategory>(DEFAULT_PRODUCT_CATEGORY);
	const [modalMode, setModalMode] = useState<CategoryModalMode>("create");
	const [modalValue, setModalValue] = useState("");
	const [isModalVisible, setIsModalVisible] = useState(false);

	const selectedCategory = useMemo(
		() =>
			categories.find((category) => category.id === selectedCategoryId) ??
			categories[0],
		[categories, selectedCategoryId],
	);
	const canMutateSelectedCategory = !!selectedCategory && !selectedCategory.isBase;

	const refreshCategories = useCallback(async () => {
		const nextCategories = await listarCategorias();
		setCategories(nextCategories);
		setSelectedCategoryId((currentCategoryId) => {
			if (nextCategories.some((category) => category.id === currentCategoryId)) {
				return currentCategoryId;
			}

			return nextCategories[0]?.id ?? DEFAULT_PRODUCT_CATEGORY;
		});
	}, []);

	useFocusEffect(
		useCallback(() => {
			refreshCategories();
		}, [refreshCategories]),
	);

	function openCreateModal() {
		setModalMode("create");
		setModalValue("");
		setIsModalVisible(true);
	}

	function openEditModal() {
		if (!canMutateSelectedCategory || !selectedCategory) return;

		setModalMode("edit");
		setModalValue(selectedCategory.label);
		setIsModalVisible(true);
	}

	function closeModal() {
		setIsModalVisible(false);
		setModalValue("");
	}

	async function handleSubmitCategory() {
		if (modalMode === "create") {
			const category = await crearCategoria({ label: modalValue });
			if (category) setSelectedCategoryId(category.id);
		} else if (selectedCategory) {
			const category = await editarCategoria(selectedCategory.id, {
				label: modalValue,
			});
			if (category) setSelectedCategoryId(category.id);
		}

		closeModal();
		refreshCategories();
	}

	async function handleDeleteCategory() {
		if (!canMutateSelectedCategory || !selectedCategory) return;

		const deleted = await eliminarCategoria(selectedCategory.id);

		if (deleted) {
			setSelectedCategoryId(DEFAULT_PRODUCT_CATEGORY);
			refreshCategories();
		}
	}

	return (
		<SafeAreaView className="flex-1 bg-base-white">
			<Stack.Screen options={{ headerShown: false }} />
			<Header />

			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				alwaysBounceVertical
				contentInsetAdjustmentBehavior="automatic">
				<View className="gap-6 px-4 pb-36 pt-4">
					<View className="flex-row items-center gap-4">
						<IconButton
							label="Volver a configuración"
							onPress={() => router.back()}
						/>
						<Text
							numberOfLines={1}
							adjustsFontSizeToFit
							className="font-mono-bold text-4xl leading-[48px] text-base-black">
							Categorias
						</Text>
					</View>

					<View className="w-full max-w-[263px] gap-4 pb-1 pr-1">
						{categories.map((category) => (
							<CategoryRow
								key={category.id}
								category={category}
								selected={category.id === selectedCategory?.id}
								onPress={() => setSelectedCategoryId(category.id)}
							/>
						))}
					</View>

					<View className="flex-row flex-wrap gap-[18px]">
						<CategoryActionButton
							label="Añadir"
							variant="add"
							onPress={openCreateModal}
						/>
						<CategoryActionButton
							label="Eliminar"
							variant="delete"
							disabled={!canMutateSelectedCategory}
							onPress={handleDeleteCategory}
						/>
						<CategoryActionButton
							label="Editar"
							variant="edit"
							disabled={!canMutateSelectedCategory}
							onPress={openEditModal}
						/>
					</View>
				</View>
			</ScrollView>

			<CategoryFormModal
				mode={modalMode}
				value={modalValue}
				visible={isModalVisible}
				onCancel={closeModal}
				onChange={setModalValue}
				onSubmit={handleSubmitCategory}
			/>
		</SafeAreaView>
	);
}
