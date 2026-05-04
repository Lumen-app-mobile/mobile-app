import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  CameraMode,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";

import { useEffect, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/layout/Header/Header";
import BrutalButton from "@/components/ui/BrutalButton/BrutalButton";
import CategorySelect, {
  ProductCategory,
} from "@/components/ui/CategorySelect/CategorySelect";
import FacturaPickerSheet from "@/components/ui/FacturaPickerSheet/FacturaPickerSheet";
import FacturaPreviewModal from "@/components/ui/FacturaPreviewModal/FacturaPreviewModal";
import StatusCard from "@/components/ui/StatusCard/StatusCard";
import TextField from "@/components/ui/FormInput/FormInput";
import colors from "@/constants/colors";
import { Factura, FacturaUploadStatus } from "@/domain/factura/factura.types";
import {
  agregarProductoManualAFactura,
  listarFacturas,
  subirFacturaMock,
} from "@/services/facturas";

type ScanTab = "photo" | "manual";

function BrowserTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: ScanTab;
  onTabChange: (tab: ScanTab) => void;
}) {
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

function ScanCaptureButton({
  status,
  onCapture,
}: {
  status: FacturaUploadStatus;
  onCapture: () => void;
}) {
  const isUploading = status === "uploading";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Hacer foto de factura"
      disabled={isUploading}
      onPress={onCapture}
      style={{
        alignItems: "center",
        backgroundColor: colors.base.white,
        borderColor: colors.base.black,
        borderWidth: 3,
        height: 359,
        justifyContent: "center",
        shadowColor: colors.base.black,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 1,
        width: "100%",
        elevation: 5,
      }}
    >
      <View
        style={{
          alignItems: "center",
          backgroundColor: colors.primary.v1,
          borderColor: colors.base.black,
          borderWidth: 3,
          height: 128,
          justifyContent: "center",
          shadowColor: colors.base.black,
          shadowOffset: { width: 4, height: 4 },
          shadowOpacity: 1,
          shadowRadius: 1,
          width: 128,
          elevation: 5,
        }}
      >
        <MaterialIcons
          name={isUploading ? "hourglass-empty" : "photo-camera"}
          size={64}
          color={colors.base.white}
        />
      </View>

      <Text className="mt-6 font-mono-bold text-2xl leading-[32px] text-base-black">
        {isUploading ? "Subiendo factura" : "Hacer foto"}
      </Text>
      <Text className="mt-2 px-8 text-center font-mono text-sm leading-[18px] text-secondary-v2">
        Captura la factura y revisa la previsualización antes de enviarla.
      </Text>
    </Pressable>
  );
}

function FacturaPreviewModalContent({
  visible,
  uploading,
  onUpload,
  onRetake,
}: {
  visible: boolean;
  uploading: boolean;
  onUpload: () => void;
  onRetake: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRetake}
    >
      <View className="flex-1 items-center justify-center bg-base-black/70 px-5">
        <View className="w-full max-w-[390px] gap-4 border-[3px] border-base-black bg-base-white p-4 shadow-[4px_4px_1px_black]">
          <View className="flex-row items-start justify-between gap-3">
            <View className="min-w-0 flex-1">
              <Text className="font-mono-bold text-2xl leading-[32px] text-base-black">
                Previsualización
              </Text>
              <Text className="font-mono text-sm leading-[18px] text-secondary-v2">
                Comprueba que la factura se ve clara antes de subirla.
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cerrar previsualización"
              onPress={onRetake}
              className="h-[42px] w-[42px] items-center justify-center border-[3px] border-base-black bg-base-white shadow-[4px_4px_1px_black]"
            >
              <MaterialIcons name="close" size={22} color={colors.base.black} />
            </Pressable>
          </View>

          <View className="h-[360px] w-full items-center justify-center border-[3px] border-base-black bg-primary-v4">
            <View className="h-[292px] w-[210px] gap-4 border-[3px] border-base-black bg-base-white p-4">
              <View className="h-4 w-28 bg-primary-v1" />
              <View className="h-3 w-full bg-secondary-v3" />
              <View className="h-3 w-4/5 bg-secondary-v3" />
              <View className="h-24 w-full border-[3px] border-base-black bg-base-white" />
              <View className="h-3 w-full bg-secondary-v3" />
              <View className="h-3 w-3/4 bg-secondary-v3" />
              <View className="mt-auto h-8 w-full bg-primary-v1" />
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="min-w-0 flex-1">
              <BrutalButton
                label="Volver a hacer"
                icon="photo-camera"
                variant="secondary"
                fullWidth
                disabled={uploading}
                onPress={onRetake}
              />
            </View>
            <View className="min-w-0 flex-1">
              <BrutalButton
                label={uploading ? "Subiendo" : "Subir"}
                icon={uploading ? "hourglass-empty" : "upload-file"}
                fullWidth
                disabled={uploading}
                onPress={onUpload}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function ManualEntryPanel({
  selectedFactura,
  name,
  category,
  amount,
  market,
  onAmountChange,
  onCategoryChange,
  onMarketChange,
  onNameChange,
  onOpenManualFlow,
  onManualSubmit,
}: {
  selectedFactura: Factura | null;
  name: string;
  category: ProductCategory;
  amount: string;
  market: string;
  onAmountChange: (value: string) => void;
  onCategoryChange: (value: ProductCategory) => void;
  onMarketChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onOpenManualFlow: () => void;
  onManualSubmit: () => void;
}) {
  return (
    <View className="gap-5 border-[3px] border-base-black bg-base-white p-4 shadow-[4px_4px_1px_black]">
      {selectedFactura ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cambiar factura seleccionada"
          onPress={onOpenManualFlow}
          className="flex-row items-center justify-between gap-3 border-[3px] border-base-black bg-primary-v4 p-3"
        >
          <View className="min-w-0 flex-1">
            <Text
              numberOfLines={1}
              className="font-mono text-xs leading-[15px] text-secondary-v2"
            >
              Factura seleccionada
            </Text>
            <Text
              numberOfLines={1}
              className="font-mono-bold text-base leading-5 text-base-black"
            >
              {selectedFactura.displayName}
            </Text>
          </View>
          <MaterialIcons
            name="expand-more"
            size={24}
            color={colors.base.black}
          />
        </Pressable>
      ) : null}

      <TextField
        label="Nombre"
        value={name}
        onChangeText={onNameChange}
        placeholder="Nombre del producto"
        size="md"
      />

      <View className="gap-5 md:flex-row">
        <View className="min-w-0 flex-1">
          <TextField
            label="Importe"
            value={amount}
            onChangeText={onAmountChange}
            placeholder="0,00"
            keyboardType="numeric"
            size="md"
          />
        </View>
        <View className="min-w-0 flex-1">
          <TextField
            label="Mercado"
            value={market}
            onChangeText={onMarketChange}
            placeholder="Comercio"
            size="md"
          />
        </View>
      </View>

      <CategorySelect value={category} onChange={onCategoryChange} />

      <View className="gap-3 sm:flex-row">
        <View className="min-w-0 flex-1">
          <BrutalButton
            label="Vincular producto"
            icon="add"
            fullWidth
            onPress={onManualSubmit}
          />
        </View>
        <View className="min-w-0 flex-1">
          <BrutalButton
            label="Elegir factura"
            icon="receipt-long"
            variant="secondary"
            fullWidth
            onPress={onOpenManualFlow}
          />
        </View>
      </View>
    </View>
  );
}

export default function ScanScreen() {
  const [uploadStatus, setUploadStatus] = useState<FacturaUploadStatus>("idle");
  const [ultimaFacturaId, setLastFacturaId] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | undefined>();
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ProductCategory>("obligacion");
  const [amount, setAmount] = useState("");
  const [market, setMarket] = useState("");
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<ScanTab>("photo");
  const facturaPickerRef = useRef<BottomSheetModal>(null);

  // Camera states
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [mode, setMode] = useState<CameraMode>("picture");
  const [facing, setFacing] = useState<CameraType>("back");
  const [showCamera, setShowCamera] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    listarFacturas(5).then((nextFacturas) => {
      setFacturas(nextFacturas);
      setSelectedFactura(
        (currentFactura) => currentFactura ?? nextFacturas[0] ?? null,
      );
    });
  }, []);

  // Camera permission check
  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-base-white">
        <View className="flex-1 items-center justify-center px-4">
          <Text className="mb-4 text-center font-mono text-base text-base-black">
            Necesitamos permisos para usar la cámara
          </Text>
          <BrutalButton label="Conceder permiso" onPress={requestPermission} />
        </View>
      </SafeAreaView>
    );
  }

  function handleOpenManualFlow() {
    facturaPickerRef.current?.present();
  }

  function handleCloseManualFlow() {
    facturaPickerRef.current?.dismiss();
  }

  function handleSelectFactura(factura: Factura) {
    setSelectedFactura(factura);
    handleCloseManualFlow();
  }

  function handleCaptureFactura() {
    setShowCamera(true);
  }

  function handleRetakeFactura() {
    if (uploadStatus !== "uploading") setIsPreviewVisible(false);
  }

  const takePicture = async () => {
    const photo = await cameraRef.current?.takePictureAsync({
      shutterSound: false,
      skipProcessing: true,
    });
    if (photo?.uri) {
      setUri(photo.uri);
      setShowCamera(false);
      setIsPreviewVisible(true);
    }
  };

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
      const response = await fetch("http://10.196.17.218:3000/api/factura", {
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
        setIsPreviewVisible(false);
        // Trigger the upload status update
        handleUploadFactura();
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

  async function handleUploadFactura() {
    setUploadStatus("uploading");
    setStatusError(undefined);

    const result = await subirFacturaMock();
    setUploadStatus(result.status);
    setLastFacturaId(result.facturaId ?? null);
    setStatusError(result.errorMessage);
    setIsPreviewVisible(false);

    const nextFacturas = await listarFacturas(5);
    setFacturas(nextFacturas);
    if (result.facturaId) {
      const uploadedFactura = nextFacturas.find(
        (factura) => factura.id === result.facturaId,
      );
      setSelectedFactura(uploadedFactura ?? nextFacturas[0] ?? null);
    }
  }

  async function handleManualSubmit() {
    const parsedAmount = Number(amount.trim().replace(",", "."));

    if (
      !selectedFactura ||
      !name.trim() ||
      !market.trim() ||
      !Number.isFinite(parsedAmount)
    ) {
      setUploadStatus("error");
      setStatusError("Selecciona una factura y completa todos los campos.");
      handleOpenManualFlow();
      return;
    }

    const updatedFactura = await agregarProductoManualAFactura(
      selectedFactura.id,
      {
        name: name.trim(),
        category,
        amount: parsedAmount,
        market: market.trim(),
      },
    );

    if (!updatedFactura) {
      setUploadStatus("error");
      setStatusError("No se pudo vincular el producto a la factura.");
      return;
    }

    setSelectedFactura(updatedFactura);
    setLastFacturaId(updatedFactura.id);
    setUploadStatus("success");
    setStatusError(undefined);
    setName("");
    setAmount("");
    setMarket("");
    setFacturas(await listarFacturas(5));
  }

  const completedUploadStatus =
    uploadStatus === "success" ||
    uploadStatus === "not_complete" ||
    uploadStatus === "error"
      ? uploadStatus
      : null;

  // Camera render functions
  const renderCamera = () => {
    return (
      <View style={StyleSheet.absoluteFill}>
        <CameraView
          style={StyleSheet.absoluteFill}
          animateShutter={false}
          ref={cameraRef}
          mode={mode}
          facing={facing}
          mute={true}
          responsiveOrientationWhenOrientationLocked
        />
        <Pressable
          style={styles.closeButton}
          onPress={() => setShowCamera(false)}
        >
          <MaterialIcons name="close" size={24} color="white" />
        </Pressable>
        <View style={styles.shutterContainer}>
          <Pressable onPress={() => setShowCamera(false)}>
            <MaterialIcons name="arrow-back" size={32} color="white" />
          </Pressable>
          <Pressable onPress={takePicture}>
            <View style={styles.shutterBtn}>
              <View style={styles.shutterBtnInner} />
            </View>
          </Pressable>
          <Pressable onPress={toggleFacing}>
            <MaterialIcons name="flip-camera-ios" size={32} color="white" />
          </Pressable>
        </View>
      </View>
    );
  };

  if (showCamera) {
    return renderCamera();
  }

  return (
    <SafeAreaView className="flex-1 bg-base-white">
      <Header />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="gap-4 px-4 pb-36 pt-4">
          <Text className="font-mono-bold text-4xl leading-[48px] text-base-black">
            scan
          </Text>

          <BrowserTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <View className="-mt-4 border-[3px] border-base-black bg-base-white p-4 shadow-[4px_4px_1px_black]">
            {activeTab === "photo" ? (
              <View className="gap-4">
                <ScanCaptureButton
                  status={uploadStatus}
                  onCapture={handleCaptureFactura}
                />

                {completedUploadStatus ? (
                  <StatusCard
                    status={completedUploadStatus}
                    facturaId={ultimaFacturaId}
                    errorMessage={statusError}
                    onManualPress={() => {
                      setActiveTab("manual");
                      handleOpenManualFlow();
                    }}
                  />
                ) : null}
              </View>
            ) : (
              <ManualEntryPanel
                selectedFactura={selectedFactura}
                name={name}
                category={category}
                amount={amount}
                market={market}
                onNameChange={setName}
                onCategoryChange={setCategory}
                onAmountChange={setAmount}
                onMarketChange={setMarket}
                onOpenManualFlow={handleOpenManualFlow}
                onManualSubmit={handleManualSubmit}
              />
            )}
          </View>

          {activeTab === "photo" && selectedFactura ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Abrir entrada manual"
              onPress={() => setActiveTab("manual")}
              className="flex-row items-center justify-between gap-3 border-[3px] border-base-black bg-base-white p-3 shadow-[4px_4px_1px_black]"
            >
              <View className="min-w-0 flex-1">
                <Text className="font-mono-bold text-base leading-5 text-base-black">
                  Entrada manual
                </Text>
                <Text
                  numberOfLines={1}
                  className="font-mono text-xs leading-[15px] text-secondary-v2"
                >
                  Vincula productos a {selectedFactura.displayName}
                </Text>
              </View>
              <MaterialIcons
                name="arrow-forward"
                size={24}
                color={colors.primary.v1}
              />
            </Pressable>
          ) : null}
        </View>
      </ScrollView>

      <FacturaPreviewModal
        visible={isPreviewVisible}
        uploading={uploadStatus === "uploading"}
        imageUri={uri}
        message={message}
        onUpload={sendInvoice}
        onRetake={handleRetakeFactura}
      />

      <FacturaPickerSheet
        bottomSheetModalRef={facturaPickerRef}
        facturas={facturas}
        facturaSeleccionadaId={selectedFactura?.id ?? null}
        onClose={handleCloseManualFlow}
        onSelect={handleSelectFactura}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: "white",
  },
});
