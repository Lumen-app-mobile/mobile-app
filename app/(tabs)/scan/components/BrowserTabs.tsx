import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import colors from "@/constants/colors";

type ScanTab = "photo" | "manual";

interface BrowserTabsProps {
  activeTab: ScanTab;
  onTabChange: (tab: ScanTab) => void;
}

export default function BrowserTabs({ activeTab, onTabChange }: BrowserTabsProps) {
  const tabs: {
    key: ScanTab;
    label: string;
    icon: keyof typeof MaterialIcons.glyphMap;
  }[] = [
    { key: "photo", label: "Foto", icon: "photo-camera" },
    { key: "manual", label: "Manual", icon: "edit" },
  ];

  return (
    <View className="w-full flex-row items-end">
      {tabs.map((tab) => {
        const active = tab.key === activeTab;

        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onTabChange(tab.key)}
            className={`min-h-[52px] flex-1 flex-row items-center justify-center gap-2 border-[3px] border-base-black px-3 py-3 ${
              active ? "bg-primary-v1" : "bg-base-white"
            }`}
            style={{
              borderBottomWidth: active ? 0 : 3,
              shadowColor: active ? colors.base.black : "transparent",
              shadowOffset: { width: 4, height: 4 },
              shadowOpacity: active ? 1 : 0,
              shadowRadius: 1,
              elevation: active ? 5 : 0,
              zIndex: active ? 2 : 1,
            }}
          >
            <MaterialIcons
              name={tab.icon}
              size={22}
              color={active ? colors.base.white : colors.primary.v1}
            />
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              className={`font-mono-bold text-xs leading-[15px] uppercase ${
                active ? "text-base-white" : "text-primary-v1"
              }`}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}