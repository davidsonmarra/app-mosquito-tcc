import TextComponent, { TextType } from "@/components/text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import AuthService from "../services/auth";

const API_BASE_URL =
  "https://deteccao-criadouro-api-949210563435.southamerica-east1.run.app";

const { width, height } = Dimensions.get("window");

interface UploadResponse {
  success: boolean;
  message: string;
  uploaded_image: string;
  result_id: number;
  failed_count: number;
}

export default function CameraScreen() {
  const { campaignId, type } = useLocalSearchParams();
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState<
    "terreno" | "propriedade" | null
  >((type as "terreno" | "propriedade") || null);
  const cameraRef = useRef<any>(null);
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  if (!permission?.granted) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <TextComponent type={TextType.textMediumRegular}>
          É necessário permitir o acesso à câmera
        </TextComponent>
        <Pressable
          style={[styles.button, { marginTop: 16 }]}
          onPress={requestPermission}
        >
          <TextComponent type={TextType.textMediumSemiBold}>
            Permitir acesso
          </TextComponent>
        </Pressable>
      </View>
    );
  }

  const handleTakePhoto = async () => {
    try {
      if (!cameraRef.current) {
        console.log("Camera ref is null");
        return;
      }

      console.log("Taking photo...");
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        skipProcessing: true,
        exif: false,
        imageType: "jpg",
        onPictureSaved: (result: any) => {
          console.log("Photo saved with dimensions:", {
            width: result.width,
            height: result.height,
            uri: result.uri,
          });

          if (result.uri) {
            const timestamp = new Date().getTime();
            const photoUri = `${result.uri}?timestamp=${timestamp}`;
            console.log("Setting photo URI:", photoUri);
            setPhoto(photoUri);
          }
        },
      });

      console.log("Photo result:", photo);
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Erro", "Não foi possível tirar a foto. Tente novamente.");
    }
  };

  const handleRetakePhoto = () => {
    setPhoto(null);
    setSelectedType((type as "terreno" | "propriedade") || null);
  };

  const getCurrentLocation = async (): Promise<{
    lat: string;
    lng: string;
  } | null> => {
    try {
      // Verificar e solicitar permissão de localização
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permissão de localização negada");
        return null;
      }

      // Obter localização atual
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        lat: location.coords.latitude.toString(),
        lng: location.coords.longitude.toString(),
      };
    } catch (error) {
      console.error("Erro ao obter localização:", error);
      return null;
    }
  };

  const uploadPhoto = async (photoUri: string): Promise<UploadResponse> => {
    try {
      // Obter userId do usuário autenticado
      const user = await AuthService.getUser();
      if (!user || !user.id) {
        throw new Error("Usuário não autenticado");
      }

      const userId = parseInt(user.id, 10);
      if (isNaN(userId)) {
        throw new Error("ID do usuário inválido");
      }

      // Validar parâmetros - campaignId é opcional
      const campaignIdNum = campaignId
        ? parseInt(campaignId as string, 10)
        : null;

      // Apenas validar se campaignId foi fornecido mas é inválido
      if (campaignId && (!campaignIdNum || isNaN(campaignIdNum))) {
        throw new Error("ID da campanha inválido");
      }

      // Usar tipo selecionado pelo usuário
      if (!selectedType) {
        throw new Error("Tipo de análise não selecionado");
      }
      const photoType = selectedType;

      // Obter localização atual
      const coordinates = await getCurrentLocation();

      // Obter token para autenticação
      const token = await AuthService.getToken();

      // Criar FormData para multipart/form-data
      const formData = new FormData();

      // Adicionar arquivo
      const filename = photoUri.split("/").pop() || "photo.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const fileType = match ? `image/${match[1]}` : "image/jpeg";

      formData.append("file", {
        uri: photoUri,
        name: filename,
        type: fileType,
      } as any);

      // Adicionar outros campos
      formData.append("userId", userId.toString());

      // Adicionar campaignId (0 se não existir)
      formData.append(
        "campaignId",
        campaignIdNum ? campaignIdNum.toString() : "0"
      );

      formData.append("type", photoType);

      // Adicionar coordenadas (JSON string)
      // Se não conseguir obter localização, envia null
      const coordinatesJson = coordinates
        ? JSON.stringify({ lat: coordinates.lat, lng: coordinates.lng })
        : JSON.stringify({ lat: null, lng: null });
      formData.append("coordinates", coordinatesJson);

      // Fazer requisição
      const headers: Record<string, string> = {
        accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const response = await fetch(`${API_BASE_URL}/results/uploadImage`, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro na resposta da API:", errorText);
        throw new Error(
          `Erro ao enviar foto: ${response.status} ${response.statusText}`
        );
      }

      const data: UploadResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao fazer upload da foto:", error);
      throw error;
    }
  };

  const handleConfirmPhoto = async () => {
    if (!photo) return;

    if (!selectedType) {
      Alert.alert(
        "Atenção",
        "Por favor, selecione o tipo de análise (Terreno ou Propriedade)"
      );
      return;
    }

    setUploading(true);
    try {
      const result = await uploadPhoto(photo);

      if (result.success) {
        Alert.alert("Sucesso!", "Foto enviada para análise com sucesso!", [
          {
            text: "OK",
            onPress: () => {
              router.back();
            },
          },
        ]);
      } else {
        throw new Error(result.message || "Erro ao enviar foto");
      }
    } catch (error) {
      console.error("Erro ao enviar foto:", error);
      Alert.alert(
        "Erro",
        error instanceof Error
          ? error.message
          : "Não foi possível enviar a foto. Tente novamente."
      );
    } finally {
      setUploading(false);
    }
  };

  if (photo) {
    console.log("Rendering preview with photo:", photo);
    return (
      <View style={styles.container}>
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: photo }}
            style={styles.preview}
            resizeMode="contain"
            fadeDuration={0}
            onError={(error) =>
              console.error("Error loading image:", error.nativeEvent.error)
            }
            onLoad={() => console.log("Image loaded successfully")}
          />
        </View>

        {/* Seleção de Tipo */}
        <View style={styles.typeSelectionContainer}>
          <TextComponent
            type={TextType.textMediumSemiBold}
            style={styles.typeLabel}
          >
            Tipo de Análise:
          </TextComponent>
          <View style={styles.typeButtons}>
            <Pressable
              style={[
                styles.typeButton,
                selectedType === "terreno" && styles.typeButtonSelected,
                uploading && styles.typeButtonDisabled,
              ]}
              onPress={() => !uploading && setSelectedType("terreno")}
              disabled={uploading}
            >
              <MaterialIcons
                name="landscape"
                size={24}
                color={selectedType === "terreno" ? "white" : "#9E9E9E"}
              />
              <TextComponent
                type={TextType.textSmallRegular}
                style={[
                  styles.typeButtonText,
                  {
                    color: selectedType === "terreno" ? "white" : "#9E9E9E",
                  },
                ]}
              >
                Terreno
              </TextComponent>
            </Pressable>
            <Pressable
              style={[
                styles.typeButton,
                selectedType === "propriedade" && styles.typeButtonSelected,
                uploading && styles.typeButtonDisabled,
              ]}
              onPress={() => !uploading && setSelectedType("propriedade")}
              disabled={uploading}
            >
              <MaterialIcons
                name="home"
                size={24}
                color={selectedType === "propriedade" ? "white" : "#9E9E9E"}
              />
              <TextComponent
                type={TextType.textSmallRegular}
                style={[
                  styles.typeButtonText,
                  {
                    color: selectedType === "propriedade" ? "white" : "#9E9E9E",
                  },
                ]}
              >
                Propriedade
              </TextComponent>
            </Pressable>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <Pressable
            style={styles.button}
            onPress={handleRetakePhoto}
            disabled={uploading}
          >
            <MaterialIcons name="replay" size={32} color="white" />
            <TextComponent
              type={TextType.textSmallRegular}
              style={styles.buttonText}
            >
              Tirar novamente
            </TextComponent>
          </Pressable>
          <Pressable
            style={[
              styles.button,
              (!selectedType || uploading) && styles.buttonDisabled,
            ]}
            onPress={handleConfirmPhoto}
            disabled={!selectedType || uploading}
          >
            {uploading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <MaterialIcons name="check" size={32} color="white" />
                <TextComponent
                  type={TextType.textSmallRegular}
                  style={styles.buttonText}
                >
                  Confirmar
                </TextComponent>
              </>
            )}
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        enableTorch={false}
        onMountError={(error) => {
          console.error("Camera mount error:", error);
          Alert.alert("Erro", "Não foi possível inicializar a câmera.");
        }}
      >
        <View style={styles.buttonsContainer}>
          <Pressable style={styles.button} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={32} color="white" />
            <TextComponent
              type={TextType.textSmallRegular}
              style={styles.buttonText}
            >
              Voltar
            </TextComponent>
          </Pressable>
          <Pressable style={styles.button} onPress={handleTakePhoto}>
            <MaterialIcons name="camera" size={32} color="white" />
            <TextComponent
              type={TextType.textSmallRegular}
              style={styles.buttonText}
            >
              Tirar foto
            </TextComponent>
          </Pressable>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  preview: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  buttonsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  buttonText: {
    color: "white",
    marginTop: 5,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  typeSelectionContainer: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
  },
  typeLabel: {
    marginBottom: 12,
    color: "white",
  },
  typeButtons: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },
  typeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#9E9E9E",
    backgroundColor: "rgba(255,255,255,0.1)",
    minWidth: 120,
    justifyContent: "center",
    gap: 8,
  },
  typeButtonSelected: {
    borderColor: "#007AFF",
    backgroundColor: "rgba(0,122,255,0.3)",
  },
  typeButtonDisabled: {
    opacity: 0.5,
  },
  typeButtonText: {
    fontWeight: "500",
  },
});
