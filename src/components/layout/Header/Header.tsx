import colors from "@/constants/colors";
import { Pressable, View } from "react-native";
import { SvgXml } from "react-native-svg";
import Logo from "@/assets/images/logo.svg";

type HeaderProps = {
	onNotificationsPress?: () => void;
};

const BELL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="${colors.base.white}"/>
</svg>`;

const HEADER_MAX_WIDTH = 1280;
const LOGO_WIDTH = 173;
const LOGO_HEIGHT = 50.42;
const NOTIFICATION_BUTTON_SIZE = 46;

export default function Header({ onNotificationsPress }: HeaderProps) {
	return (
		<View
			style={{
				backgroundColor: colors.base.white,
				borderBottomColor: colors.base.black,
				borderBottomWidth: 3,
				minHeight: 85.42,
				paddingBottom: 19,
				paddingHorizontal: 16,
				paddingTop: 16,
				width: "100%",
			}}>
			<View
				style={{
					alignItems: "flex-start",
					alignSelf: "center",
					flexDirection: "row",
					justifyContent: "space-between",
					maxWidth: HEADER_MAX_WIDTH,
					width: "100%",
				}}>
				<View style={{ flexShrink: 0 }}>
					<Logo
						width={LOGO_WIDTH}
						height={LOGO_HEIGHT}
					/>
				</View>

				<Pressable
					onPress={onNotificationsPress}
					accessibilityRole="button"
					accessibilityLabel="Notificaciones"
					style={{
						alignItems: "center",
						backgroundColor: colors.primary.v1,
						borderColor: colors.base.black,
						borderWidth: 3,
						flexShrink: 0,
						height: NOTIFICATION_BUTTON_SIZE,
						justifyContent: "center",
						marginLeft: 12,
						padding: 11,
						shadowColor: colors.base.black,
						shadowOffset: { width: 4, height: 4 },
						shadowOpacity: 1,
						shadowRadius: 1,
						width: NOTIFICATION_BUTTON_SIZE,
						elevation: 4,
					}}>
					<SvgXml
						xml={BELL_SVG}
						width={24}
						height={24}
					/>
				</Pressable>
			</View>
		</View>
	);
}
