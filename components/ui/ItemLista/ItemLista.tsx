import { Pressable, Text, View } from "react-native";

import colors from "@/constants/colors";

type ItemListaVariant = "default" | "listHeader";

interface ItemListaProps {
	variant?: ItemListaVariant;
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
const TRIANGLE_WIDTH = 30;
const TRIANGLE_HEIGHT = 26;
const BODY_FONT_SIZE = 16;
const BODY_LINE_HEIGHT = 20;
const META_FONT_SIZE = 12;
const META_LINE_HEIGHT = 15;
const FONT_FAMILY = "RedHatMono_500Medium";

function Indicador() {
	return (
		<View
			style={{
				width: 0,
				height: 0,
				borderLeftWidth: TRIANGLE_WIDTH / 2,
				borderRightWidth: TRIANGLE_WIDTH / 2,
				borderBottomWidth: TRIANGLE_HEIGHT,
				borderLeftColor: "transparent",
				borderRightColor: "transparent",
				borderBottomColor: colors.category.obligacion.v1,
			}}
		/>
	);
}

export default function ItemLista({
	variant = "default",
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
		overflow: "hidden" as const,
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
			<View style={{ flexDirection: "row", alignItems: "center", gap: CONTENT_GAP }}>
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

			{isDefault && showIndicator ? <Indicador /> : null}
		</Pressable>
	);
}
