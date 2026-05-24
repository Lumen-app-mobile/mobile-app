import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SvgXml } from "react-native-svg";

import Logo from "@/assets/images/logo.svg";
import colors from "@/constants/colors";
import { FacturaNotification } from "@/domain/factura/factura.types";
import { useNotification } from "@/lib/notification";

type HeaderProps = {
	notifications?: FacturaNotification[];
	onNotificationsPress?: () => void;
	onNotificationPress?: (notification: FacturaNotification) => void;
};

const BELL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="${colors.base.white}"/>
</svg>`;

const HEADER_MAX_WIDTH = 1280;
const LOGO_WIDTH = 173;
const LOGO_HEIGHT = 50.42;
const NOTIFICATION_BUTTON_SIZE = 46;
export default function Header({
	notifications: propNotifications,
	onNotificationsPress,
	onNotificationPress,
}: HeaderProps) {
	const { notifications: contextNotifications, markAllAsRead } = useNotification();
	const notifications = propNotifications ?? contextNotifications;
	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

	function handleNotificationsPress() {
		onNotificationsPress?.();
		setIsNotificationsOpen((currentValue) => {
			if (!currentValue) markAllAsRead();
			return !currentValue;
		});
	}

	function handleNotificationPress(notification: FacturaNotification) {
		onNotificationPress?.(notification);
		setIsNotificationsOpen(false);
		router.push(`/facturas/${notification.facturaId}`);
	}

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
				zIndex: 20,
			}}>
			<View
				style={{
					alignItems: "flex-start",
					alignSelf: "center",
					flexDirection: "row",
					justifyContent: "space-between",
					maxWidth: HEADER_MAX_WIDTH,
					width: "100%",
					zIndex: 20,
				}}>
				<View style={{ flexShrink: 0 }}>
					<Logo
						width={LOGO_WIDTH}
						height={LOGO_HEIGHT}
					/>
				</View>

				<View
					style={{
						flexShrink: 0,
						marginLeft: 12,
						position: "relative",
						zIndex: 30,
					}}>
					<Pressable
						onPress={handleNotificationsPress}
						accessibilityRole="button"
						accessibilityLabel="Notificaciones"
						accessibilityState={{ expanded: isNotificationsOpen }}
						style={{
							alignItems: "center",
							backgroundColor: colors.primary.v1,
							borderColor: colors.base.black,
							borderWidth: 3,
							height: NOTIFICATION_BUTTON_SIZE,
							justifyContent: "center",
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

					{isNotificationsOpen ? (
						<View
							style={{
								backgroundColor: colors.base.white,
								borderColor: colors.base.black,
								borderWidth: 3,
								elevation: 12,
								gap: 12,
								padding: 12,
								position: "absolute",
								right: 0,
								shadowColor: colors.base.black,
								shadowOffset: { width: 4, height: 4 },
								shadowOpacity: 1,
								shadowRadius: 1,
								top: NOTIFICATION_BUTTON_SIZE + 10,
								width: 292,
								zIndex: 40,
							}}>
							<Text
								style={{
									color: colors.base.black,
									fontFamily: "RedHatMono_700Bold",
									fontSize: 16,
									lineHeight: 20,
								}}>
								Notificaciones
							</Text>

							{notifications.map((notification) => (
								<Pressable
									key={notification.id}
									accessibilityRole="button"
									accessibilityLabel={notification.title}
									onPress={() => handleNotificationPress(notification)}
									style={{
										backgroundColor: colors.primary.v4,
										borderColor: colors.base.black,
										borderLeftWidth: 3,
										gap: 4,
										paddingHorizontal: 10,
										paddingVertical: 8,
									}}>
									<Text
										numberOfLines={1}
										style={{
											color: colors.base.black,
											fontFamily: "RedHatMono_700Bold",
											fontSize: 12,
											lineHeight: 16,
										}}>
										{notification.title}
									</Text>
									<Text
										style={{
											color: colors.secondary.v1,
											fontFamily: "RedHatMono_500Medium",
											fontSize: 12,
											lineHeight: 16,
										}}>
										{notification.detail}
									</Text>
								</Pressable>
							))}
						</View>
					) : null}
				</View>
			</View>
		</View>
	);
}
