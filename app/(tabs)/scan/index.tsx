import { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as DocumentPicker from "expo-document-picker";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/layout/Header/Header";
import BrutalButton from "@/components/ui/BrutalButton/BrutalButton";
import FacturaPickerSheet from "@/components/ui/FacturaPickerSheet/FacturaPickerSheet";
import FacturaPreviewModal from "@/components/ui/FacturaPreviewModal/FacturaPreviewModal";
import StatusCard from "@/components/ui/StatusCard/StatusCard";
import colors from "@/constants/colors";
import { ProductCategory } from "@/components/ui/CategorySelect/CategorySelect";

import BrowserTabs from "./components/BrowserTabs";
import type { ScanTab } from "./components/BrowserTabs";
import ScanCaptureButton from "./components/ScanCaptureButton";
import FileUploadPanel from "./components/FileUploadPanel";
import ManualEntryPanel from "./components/ManualEntryPanel";
import { useFacturaManagement } from "@/hooks/useFacturaManagement";
import { useScanCamera } from "@/hooks/useScanCamera";

export default function ScanScreen() {
  const [activeTab, setActiveTab] = useState<ScanTab>("photo");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ProductCategory>("obligacion");
  const [amount, setAmount] = useState("");
  const [market, setMarket] = useState("");
  const facturaPickerRef = useRef<BottomSheetModal>(null);

  const {
    facturas,
    selectedFactura,
    setSelectedFactura,
    uploadStatus,
    ultimaFacturaId,
    statusError,
    isPreviewVisible,
    setIsPreviewVisible,
    completedUploadStatus,
    realApi,
    handleUploadFactura,
    handleManualSubmit,
    handleSelectFactura,
  } = useFacturaManagement();

  const {
    permission,
    requestPermission,
    showCamera,
    setShowCamera,
    uri,
    setUri,
    sending,
    message,
    setMessage,
    takePicture,
    sendInvoice,
    toggleFacing,
    renderCamera,
  } = useScanCamera();

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

  function handleCaptureFactura() {
    setShowCamera(true);
  }

  async function handlePickFile() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        if (asset.mimeType?.startsWith("image/")) {
          setUri(asset.uri);
          setIsPreviewVisible(true);
        } else {
          await handleUploadFactura(asset.uri);
        }
      }
    } catch (err) {
      console.warn("[Scan] File picker error:", err);
    }
  }

  function handleRetakeFactura() {
    if (uploadStatus !== "uploading") setIsPreviewVisible(false);
  }

  const handleSendInvoice = async () => {
    setIsPreviewVisible(false);
    if (uri) {
      await handleUploadFactura(uri);
    } else {
      await sendInvoice(() => {
        handleUploadFactura();
      });
    }
  };

  const handleManualSubmitForm = () => {
    handleManualSubmit(
      selectedFactura,
      name,
      category,
      amount,
      market,
      () => {
        setName("");
        setAmount("");
        setMarket("");
      },
    );
  };

  if (showCamera) {
    return (
      <View style={{ flex: 1 }}>
        {renderCamera(
          () => takePicture(() => setIsPreviewVisible(true)),
          toggleFacing,
          () => setShowCamera(false),
        )}
      </View>
    );
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
          <View className="flex-row items-center gap-3">
            <Text className="font-mono-bold text-4xl leading-[48px] text-base-black">
              scan
            </Text>
            <View className={`self-start border-[2px] border-base-black px-2 py-1 ${realApi ? 'bg-green-200' : 'bg-red-200'}`}>
              <Text className="font-mono-bold text-[10px] leading-3">
                {realApi ? 'API' : 'MOCK'}
              </Text>
            </View>
          </View>

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
            ) : activeTab === "file" ? (
              <FileUploadPanel onPickFile={handlePickFile} />
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
                onManualSubmit={handleManualSubmitForm}
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
        onUpload={handleSendInvoice}
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

import { MaterialIcons } from "@expo/vector-icons";