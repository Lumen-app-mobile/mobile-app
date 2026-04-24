import colors from "@/constants/colors";
import { Pressable, View } from "react-native";
import { SvgXml } from "react-native-svg";
import Logo from "../../../assets/images/logo.svg";

type HeaderProps = {
	onNotificationsPress?: () => void;
};

const BELL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="${colors.base.white}"/>
</svg>`;

export default function Header({ onNotificationsPress }: HeaderProps) {
	return (
		<View
			className="w-full border-b-[3px] border-base-black bg-base-white px-4 pb-[19px] pt-4"
			style={{ minHeight: 85 }}>
			<View className="w-full flex-row items-start justify-between">
				<Logo
					width={173}
					height={50.42}
				/>

				<Pressable
					onPress={onNotificationsPress}
					className="items-center justify-center border-[3px] border-base-black bg-primary-v1 p-[11px] active:opacity-80"
					style={{
						width: 46,
						height: 46,
						shadowColor: colors.base.black,
						shadowOffset: { width: 4, height: 4 },
						shadowOpacity: 1,
						shadowRadius: 1,
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
