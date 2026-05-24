import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/layout/Header/Header";
import colors from "@/constants/colors";
import type { Factura } from "@/domain/factura/factura.types";
import type { TagDto } from "@/dtos/tag/tag.dtos";
import {
  transactionDtoListToFacturaList,
  centsToAmount,
} from "@/mappers/transaction.mapper";
import { listarTransacciones } from "@/services/transactions";
import { listarTags } from "@/services/tags";

const currencyFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

const STATUS_LABELS: Record<Factura["status"], { label: string; color: string }> = {
  pending_review: { label: "Pendiente", color: colors.feedback.warning.v1 },
  validated: { label: "Validada", color: colors.feedback.success.v1 },
  denied: { label: "Denegada", color: colors.feedback.danger.v1 },
  not_complete: { label: "Incompleta", color: colors.feedback.warning.v1 },
  error: { label: "Error", color: colors.feedback.danger.v1 },
};

const TAG_COLORS = [
  colors.primary.v1,
  colors.accent1.v1,
  colors.accent2.v1,
  colors.category.ocio.v1,
  colors.category.ahorro.v1,
  colors.category.obligacion.v1,
  colors.feedback.info.v1,
  colors.secondary.v1,
];

export default function FacturasScreen() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [allFacturas, setAllFacturas] = useState<Factura[]>([]);
  const [tags, setTags] = useState<TagDto[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  const tagColorMap = useRef<Map<number, string>>(new Map());

  function getTagColor(tagId: number): string {
    if (!tagColorMap.current.has(tagId)) {
      const idx = tagColorMap.current.size % TAG_COLORS.length;
      tagColorMap.current.set(tagId, TAG_COLORS[idx]);
    }
    return tagColorMap.current.get(tagId)!;
  }

  useFocusEffect(
    useCallback(() => {
      isMounted.current = true;

      Promise.all([listarTransacciones(), listarTags()])
        .then(([transactionDtos, tagDtos]) => {
          if (!isMounted.current) return;
          const lista = transactionDtoListToFacturaList(transactionDtos);
          setAllFacturas(lista);
          setFacturas(lista);
          setTags(tagDtos);
        })
        .catch((err) => {
          console.warn("[FacturasScreen] Failed to fetch:", err);
        })
        .finally(() => {
          if (isMounted.current) setLoading(false);
        });

      return () => {
        isMounted.current = false;
      };
    }, []),
  );

  function toggleTag(tagId: number) {
    setSelectedTagIds((prev) => {
      const next = new Set(prev);
      if (next.has(tagId)) {
        next.delete(tagId);
      } else {
        next.add(tagId);
      }

      if (next.size === 0) {
        setFacturas(allFacturas);
      } else {
        setFacturas(
          allFacturas.filter((f) =>
            f.tags.some((t) => next.has(t.id)),
          ),
        );
      }

      return next;
    });
  }

  return (
    <SafeAreaView className="flex-1 bg-base-white">
      <Header />

      <View className="flex-row items-center gap-3 px-4 pb-2 pt-4">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver"
          onPress={() => router.back()}
          className="h-[46px] flex-row items-center gap-2 self-start border-[3px] border-base-black bg-base-white px-[14px] py-[10px] shadow-[4px_4px_1px_black]"
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.base.black} />
          <Text className="font-mono-bold text-xs leading-4 text-base-black">
            Volver
          </Text>
        </Pressable>
      </View>

      <View className="px-4 pb-4">
        <Text className="font-mono-bold text-4xl leading-[48px] text-base-black">
          Facturas
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="gap-3 px-4 pb-36">
          {tags.length > 0 && (
            <View className="flex-row flex-wrap gap-2">
              <Pressable
                onPress={() => {
                  setSelectedTagIds(new Set());
                  setFacturas(allFacturas);
                }}
                className={`flex-row items-center gap-1 border-[2px] border-base-black px-3 py-1.5 ${
                  selectedTagIds.size === 0 ? "bg-base-black" : "bg-base-white"
                }`}
              >
                <Text
                  className={`font-mono-bold text-xs leading-4 ${
                    selectedTagIds.size === 0 ? "text-base-white" : "text-base-black"
                  }`}
                >
                  Todas
                </Text>
              </Pressable>
              {tags.map((tag) => {
                const isSelected = selectedTagIds.has(tag.id);
                const chipColor = getTagColor(tag.id);
                return (
                  <Pressable
                    key={tag.id}
                    onPress={() => toggleTag(tag.id)}
                    className="flex-row items-center gap-1 border-[2px] border-base-black px-3 py-1.5"
                    style={{
                      backgroundColor: isSelected ? chipColor : colors.base.white,
                    }}
                  >
                    <Text
                      className="font-mono-bold text-xs leading-4"
                      style={{
                        color: isSelected ? colors.base.white : colors.base.black,
                      }}
                    >
                      {tag.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          {loading ? (
            <Text className="font-mono text-base leading-5 text-secondary-v2">
              Cargando facturas...
            </Text>
          ) : facturas.length === 0 ? (
            <Text className="font-mono text-base leading-5 text-secondary-v2">
              No hay facturas disponibles.
            </Text>
          ) : (
            facturas.map((factura) => {
              const statusInfo = STATUS_LABELS[factura.status];
              const totalField = factura.fields.find((f) => f.key === "total");
              const total = totalField ? Number(totalField.value) : 0;

              return (
                <Pressable
                  key={factura.id}
                  accessibilityRole="button"
                  accessibilityLabel={factura.displayName}
                  onPress={() => router.push(`/facturas/${factura.id}`)}
                  className="flex-row items-center gap-3 border-[3px] border-base-black bg-base-white p-3 shadow-[4px_4px_1px_black]"
                >
                  <View
                    style={{
                      backgroundColor: statusInfo.color,
                      width: 8,
                      height: "100%",
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                    }}
                  />
                  {factura.imageUrl && (
                    <Image
                      source={{ uri: factura.imageUrl }}
                      className="h-16 w-16 border-[2px] border-base-black"
                      resizeMode="cover"
                    />
                  )}
                  <View className="ml-4 min-w-0 flex-1 gap-1">
                    <Text
                      numberOfLines={1}
                      className="font-mono-bold text-base leading-5 text-base-black"
                    >
                      {factura.displayName}
                    </Text>
                    <Text className="font-mono text-xs leading-[15px] text-secondary-v2">
                      {new Date(factura.createdAt).toLocaleDateString("es-ES")}
                    </Text>
                    {factura.tags.length > 0 && (
                      <View className="flex-row flex-wrap gap-1 pt-1">
                        {factura.tags.map((tag) => (
                          <View
                            key={tag.id}
                            className="border-[1.5px] border-base-black px-2 py-0.5"
                            style={{ backgroundColor: getTagColor(tag.id) }}
                          >
                            <Text className="font-mono-bold text-[9px] leading-3 text-base-white">
                              {tag.name}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                  <View className="items-end gap-1">
                    <Text className="font-mono-bold text-sm leading-[18px] text-accent2-v2">
                      {total > 0 ? currencyFormatter.format(centsToAmount(total)) : "—"}
                    </Text>
                    <View
                      className="self-end border-[2px] border-base-black px-2 py-0.5"
                      style={{ backgroundColor: statusInfo.color }}
                    >
                      <Text className="font-mono-bold text-[10px] leading-3 text-base-white">
                        {statusInfo.label}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
