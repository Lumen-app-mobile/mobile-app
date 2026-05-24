import { MaterialIcons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import colors from "@/constants/colors";
import { useNotification } from "@/lib/notification";

const TOAST_HEIGHT = 80;
const STATUS_LABELS: Record<string, string> = {
  pending_review: "Factura lista para revisar",
  validated: "Factura validada",
  denied: "Factura denegada",
  not_complete: "Factura incompleta",
  error: "Error",
  upload_success: "Subida completada",
};

const STATUS_ICONS: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  pending_review: "receipt-long",
  validated: "check-circle",
  denied: "cancel",
  not_complete: "error-outline",
  error: "error",
  upload_success: "cloud-done",
};

const STATUS_COLORS: Record<string, string> = {
  pending_review: colors.feedback.warning.v1,
  validated: colors.feedback.success.v1,
  denied: colors.feedback.danger.v1,
  not_complete: colors.feedback.warning.v1,
  error: colors.feedback.danger.v1,
  upload_success: colors.feedback.success.v1,
};

export default function Toast() {
  const { toast, hideToast } = useNotification();
  const translateY = useSharedValue(-TOAST_HEIGHT);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!toast) {
      translateY.value = withTiming(-TOAST_HEIGHT, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
      return;
    }

    if (toast.visibility === "visible") {
      translateY.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });
    } else if (toast.visibility === "hiding") {
      translateY.value = withTiming(-TOAST_HEIGHT, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [toast?.visibility]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!toast) return null;

  const label = STATUS_LABELS[toast.notification.title] ?? toast.notification.title;
  const iconName = STATUS_ICONS[toast.notification.title] ?? "notifications";
  const iconColor = STATUS_COLORS[toast.notification.title] ?? colors.primary.v1;

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          paddingHorizontal: 16,
          paddingTop: 50,
        },
        animatedStyle,
      ]}
    >
      <Pressable
        onPress={hideToast}
        accessibilityRole="button"
        accessibilityLabel="Cerrar notificación"
        style={{
          backgroundColor: colors.base.white,
          borderColor: colors.base.black,
          borderWidth: 3,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          padding: 12,
          shadowColor: colors.base.black,
          shadowOffset: { width: 4, height: 4 },
          shadowOpacity: 1,
          shadowRadius: 1,
          elevation: 10,
        }}
      >
        <MaterialIcons name={iconName} size={28} color={iconColor} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: "RedHatMono_700Bold",
              fontSize: 14,
              lineHeight: 18,
              color: colors.base.black,
            }}
          >
            {label}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: "RedHatMono_500Medium",
              fontSize: 12,
              lineHeight: 16,
              color: colors.secondary.v1,
            }}
          >
            {toast.notification.detail}
          </Text>
        </View>
        <MaterialIcons name="close" size={20} color={colors.secondary.v2} />
      </Pressable>
    </Animated.View>
  );
}
