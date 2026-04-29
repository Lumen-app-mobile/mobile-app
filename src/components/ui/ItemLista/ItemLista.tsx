import { Pressable, Text, View } from "react-native";

import AhorroIndicator from "@/assets/images/Property 1=ahorro.svg";
import ObligacionIndicator from "@/assets/images/Property 1=obligacion.svg";
import OcioIndicator from "@/assets/images/Property 1=ocio.svg";
import colors from "@/constants/colors";

type ItemListaVariant = "default" | "listHeader";
type ItemListaCategory = "obligacion" | "ahorro" | "ocio";

interface ItemListaProps {
	variant?: ItemListaVariant;
	category?: ItemListaCategory;
	title?: string;
	description?: string;
	price?: string;
	showIndicator?: boolean;
	onPress?: () => void;
}

const BORDER_BRUTAL = 3;
const SHADOW_OFFSET = 4;
const SHADOW_RADIUS = 1;
const ITEM_WIDTH = 216;
const ITEM_MIN_WIDTH = 160;
const PADDING_X = 8;
const PADDING_Y = 12;
const CONTENT_GAP = 8;
const INDICATOR_WIDTH = 30;
const INDICATOR_HEIGHT = 26;
const BODY_FONT_SIZE = 16;
const BODY_LINE_HEIGHT = 20;
const META_FONT_SIZE = 12;
const META_LINE_HEIGHT = 15;
const FONT_FAMILY = "RedHatMono_500Medium";

const indicatorByCategory = {
	obligacion: ObligacionIndicator,
	ahorro: AhorroIndicator,
	ocio: OcioIndicator,
} as const;

function Indicador({ category }: { category: ItemListaCategory }) {
	const Indicator = indicatorByCategory[category];

	return (
		<Indicator
			width={INDICATOR_WIDTH}
			height={INDICATOR_HEIGHT}
		/>
	);
}

export default function ItemLista({
	variant = "default",
	category = "obligacion",
	title = "listaItem",
	description = "listaItem",
	price = "???€",
	showIndicator = true,
	onPress,
}: ItemListaProps) {
	const isDefault = variant === "default";

	const containerStyle = {
		width: ITEM_WIDTH,
		minWidth: ITEM_MIN_WIDTH,
		flexDirection: "row" as const,
		alignItems: "center" as const,
		paddingHorizontal: PADDING_X,
		paddingVertical: PADDING_Y,
		backgroundColor: isDefault ? colors.base.white : colors.primary.v1,
		borderLeftWidth: BORDER_BRUTAL,
		borderBottomWidth: BORDER_BRUTAL,
		borderRightWidth: isDefault ? 0 : BORDER_BRUTAL,
		borderColor: colors.base.black,
		shadowColor: colors.base.black,
		shadowOffset: { width: SHADOW_OFFSET, height: SHADOW_OFFSET },
		shadowOpacity: 1,
		shadowRadius: SHADOW_RADIUS,
		elevation: 5,
	};

	const bodyTextStyle = {
		fontFamily: FONT_FAMILY,
		fontSize: BODY_FONT_SIZE,
		lineHeight: BODY_LINE_HEIGHT,
		color: isDefault ? colors.base.black : colors.base.white,
	};

	const metaTextStyle = {
		fontFamily: FONT_FAMILY,
		fontSize: META_FONT_SIZE,
		lineHeight: META_LINE_HEIGHT,
		color: colors.secondary.v2,
	};

	return (
		<Pressable
			onPress={onPress}
			disabled={!onPress}
			style={[
				containerStyle,
				isDefault
					? { justifyContent: "space-between" }
					: { justifyContent: "flex-start", gap: CONTENT_GAP },
			]}>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					gap: CONTENT_GAP,
				}}>
				<View style={{ alignItems: "flex-start", gap: CONTENT_GAP }}>
					{isDefault ? (
						<Text
							numberOfLines={1}
							style={metaTextStyle}>
							{description}
						</Text>
					) : null}

					<View
						style={{
							flexDirection: "row",
							alignItems: "flex-end",
							gap: CONTENT_GAP,
						}}>
						<Text
							numberOfLines={1}
							style={bodyTextStyle}>
							{title}
						</Text>

						{isDefault ? (
							<Text
								numberOfLines={1}
								style={metaTextStyle}>
								{price}
							</Text>
						) : null}
					</View>
				</View>
			</View>

			{isDefault && showIndicator ? <Indicador category={category} /> : null}
		</Pressable>
	);
}
