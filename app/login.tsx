import { Redirect, router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ImageBackground,
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TextField from "@/components/ui/FormInput/FormInput";
import colors from "@/constants/colors";
import { useAuth } from "@/lib/auth";
import Logo from "@/assets/images/logo.svg";

const backgroundImage = require("@/assets/images/Gemini_Generated_Image_9vrbv69vrbv69vrb.webp");

const SCREEN_HEIGHT = Dimensions.get("window").height;

type LoginFormProps = {
  onClose: () => void;
  onEnter: (email: string, password: string) => Promise<void>;
  onRegister: (
    email: string,
    password: string,
    username: string,
  ) => Promise<void>;
};

function LoginForm({ onClose, onEnter, onRegister }: LoginFormProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const usernameRef = useRef<TextInput>(null);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      if (mode === "register") {
        if (!username.trim()) {
          throw new Error("El nombre de usuario es obligatorio.");
        }
        await onRegister(email, password, username.trim());
      } else {
        await onEnter(email, password);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Email o contraseña incorrectos.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        backgroundColor: colors.base.white,
        padding: 24,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
      }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={{ maxHeight: SCREEN_HEIGHT * 0.5 }}
        contentContainerStyle={{ gap: 18 }}
      >
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              width: 48,
              height: 6,
              borderRadius: 999,
              backgroundColor: colors.primary.v3,
              marginBottom: 16,
            }}
          />
          <Text
            style={{
              fontSize: 28,
              fontWeight: "700",
              color: colors.base.black,
            }}
          >
            {mode === "login" ? "Login" : "Registro"}
          </Text>
          <Text
            style={{
              marginTop: 6,
              color: "#666",
              textAlign: "center",
            }}
          >
            {mode === "login"
              ? "Entra para ver tus pestañas principales."
              : "Crea tu cuenta para empezar."}
          </Text>
        </View>

        {mode === "register" ? (
          <TextField
            ref={usernameRef}
            label="Nombre de usuario"
            placeholder="juanperez"
            size="md"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
          />
        ) : null}

        <TextField
          ref={emailRef}
          label="Email"
          placeholder="tu@email.com"
          size="md"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <TextField
          ref={passwordRef}
          label="Password"
          placeholder="********"
          size="md"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />

        {error ? (
          <Text
            style={{ color: colors.feedback.danger.v1, textAlign: "center" }}
          >
            {error}
          </Text>
        ) : null}

        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          style={{
            backgroundColor: colors.secondary.v1,
            paddingVertical: 14,
            alignItems: "center",
            borderRadius: 16,
            opacity: loading ? 0.6 : 1,
          }}
        >
          <Text
            style={{
              color: colors.base.white,
              fontWeight: "700",
              fontSize: 16,
            }}
          >
            {loading
              ? "Entrando..."
              : mode === "login"
                ? "Entrar"
                : "Crear cuenta"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            setMode(mode === "login" ? "register" : "login");
            setError("");
          }}
          style={{ alignItems: "center" }}
        >
          <Text style={{ color: colors.secondary.v1 }}>
            {mode === "login"
              ? "¿No tienes cuenta? Regístrate"
              : "¿Ya tienes cuenta? Inicia sesión"}
          </Text>
        </Pressable>

        <Pressable onPress={onClose} style={{ alignItems: "center" }}>
          <Text style={{ color: "#666" }}>Cerrar</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

export default function LoginScreen() {
  const { isInitializing, signIn, register, user } = useAuth();
  const [isSheetVisible, setIsSheetVisible] = useState(true);

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const keyboardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isSheetVisible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 4,
        speed: 14,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 280,
        useNativeDriver: true,
      }).start();
    }
  }, [isSheetVisible, slideAnim]);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (e) => {
      Animated.timing(keyboardAnim, {
        toValue: -e.endCoordinates.height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });
    const hide = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(keyboardAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, [keyboardAnim]);

  const openSheet = () => setIsSheetVisible(true);
  const closeSheet = () => setIsSheetVisible(false);

  const enterApp = async (email: string, password: string) => {
    await signIn(email, password);
    router.replace("/(tabs)");
  };

  const registerApp = async (
    email: string,
    password: string,
    username: string,
  ) => {
    await register(email, password, username);
    router.replace("/(tabs)");
  };

  if (isInitializing) return <View style={{ flex: 1 }} />;
  if (user) return <Redirect href="/(tabs)" />;

  return (
    <View style={{ flex: 1, overflow: "hidden" }}>
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <View
          style={{ flex: 1, backgroundColor: "rgba(255, 255, 255, 0.6)" }}
        />
      </ImageBackground>

      <SafeAreaView
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: 24,
        }}
      >
        <Logo width={140} height={40} />
      </SafeAreaView>

      <Animated.View
        style={{
          transform: [{ translateY: Animated.add(slideAnim, keyboardAnim) }],
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <SafeAreaView edges={["bottom"]}>
          <LoginForm
            onClose={closeSheet}
            onEnter={enterApp}
            onRegister={registerApp}
          />
        </SafeAreaView>
      </Animated.View>

      {!isSheetVisible ? (
        <SafeAreaView
          edges={["bottom"]}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 24,
          }}
        >
          <Pressable
            onPress={openSheet}
            style={{
              alignSelf: "center",
              backgroundColor: colors.base.white,
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 999,
            }}
          >
            <Text style={{ fontWeight: "700" }}>Abrir login</Text>
          </Pressable>
        </SafeAreaView>
      ) : null}
    </View>
  );
}
