import {
  CameraMode,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState } from "react";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import AntDesign from "@expo/vector-icons/AntDesign";
// import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [mode, setMode] = useState<CameraMode>("picture");
  const [facing, setFacing] = useState<CameraType>("back");
  // const [recording, setRecording] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const API_URL = "http://10.196.17.218:3000/api/factura";

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to use the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  if (!showCamera) {
    return (
      <View style={styles.container}>
        <Text style={styles.scanText}>Escanea un ticket de compra</Text>
        <Button onPress={() => setShowCamera(true)} title="Tomar foto" />
      </View>
    );
  }

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync({
      shutterSound: false,
      skipProcessing: true,
    });
    if (photo?.uri) setUri(photo.uri);
  };

  // const recordVideo = async () => {
  //   if (recording) {
  //     setRecording(false);
  //     ref.current?.stopRecording();
  //     return;
  //   }
  //   setRecording(true);
  //   const video = await ref.current?.recordAsync();
  //   console.log({ video });
  // };

  // const toggleMode = () => {
  //   setMode((prev) => (prev === "picture" ? "video" : "picture"));
  // };

  const sendInvoice = async () => {
    if (!uri) return;
    setSending(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append("factura", {
        uri,
        type: "image/jpeg",
        name: "factura.jpg",
      } as any);
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Factura enviada correctamente");
        setUri(null);
        setShowCamera(false);
      } else {
        setMessage(`Error: ${data.message || "Error al enviar"}`);
      }
    } catch (error: any) {
      setMessage(`Error de conexión: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const renderPicture = (uri: string) => {
    return (
      <View style={styles.previewContainer}>
        <Image
          source={{ uri }}
          contentFit="contain"
          style={styles.previewImage}
        />
        {message && <Text style={styles.message}>{message}</Text>}
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => setUri(null)}
            title="Tomar otra foto"
            disabled={sending}
          />
          <Button
            onPress={sendInvoice}
            title={sending ? "Enviando..." : "Enviar factura"}
            disabled={sending}
          />
        </View>
      </View>
    );
  };

  const renderCamera = () => {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          animateShutter={false}
          ref={ref}
          mode={mode}
          facing={facing}
          mute={true}
          responsiveOrientationWhenOrientationLocked
        />
        <Pressable
          style={styles.closeButton}
          onPress={() => setShowCamera(false)}
        >
          <AntDesign name="close" size={24} color="white" />
        </Pressable>
        <View style={styles.shutterContainer}>
          {/*<Pressable onPress={toggleMode}>
            {mode === "picture" ? (
              <AntDesign name="picture" size={32} color="white" />
            ) : (
              <Feather name="video" size={32} color="white" />
            )}
          </Pressable>*/}
          <Pressable onPress={() => setShowCamera(false)}>
            <FontAwesome6 name="arrow-left" size={32} color="white" />
          </Pressable>
          {/*<Pressable onPress={mode === "picture" ? takePicture : recordVideo}>*/}
          <Pressable onPress={takePicture}>
            <View
              style={[
                styles.shutterBtn,
                {
                  opacity: pressed ? 0.5 : 1,
                },
              ]}
            >
              <View
                style={[
                  styles.shutterBtnInner,
                  {
                    backgroundColor: mode === "picture" ? "white" : "red",
                  },
                ]}
              />
            </View>
          </Pressable>
          <Pressable onPress={toggleFacing}>
            <FontAwesome6 name="rotate-left" size={32} color="white" />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {uri ? renderPicture(uri) : renderCamera()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  scanText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  cameraContainer: StyleSheet.absoluteFill,
  camera: StyleSheet.absoluteFill,
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
  },
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  previewContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  previewImage: {
    width: 300,
    aspectRatio: 1,
    marginBottom: 20,
  },
  message: {
    marginVertical: 10,
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
});
