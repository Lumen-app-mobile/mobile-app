import Header from "@/components/layout/Header/Header";
import ItemLista from "@/components/ui/ItemLista/ItemLista";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";

export default function HomeScreen() {
	function click() {}

	return (
		<SafeAreaView className="flex-1 bg-base-white px-5 py-4">
			<View className="gap-8">
				<Header onNotificationsPress={click} />

				<View className="items-start gap-5">
					<ItemLista
						description="listaItem"
						title="listaItem"
						price="???€"
					/>

					<ItemLista
						variant="listHeader"
						title="listaItem"
					/>
				</View>
			</View>
		</SafeAreaView>
	);
}
