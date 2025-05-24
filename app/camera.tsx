import TextComponent, { TextType } from "@/components/text";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<any>(null);
  const backgroundColor = useThemeColor({}, "background");

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
  };

  const handleConfirmPhoto = () => {
    if (!photo) return;

    // TODO: Implementar o envio da foto para o backend
    Alert.alert("Sucesso", "Foto enviada para análise!");
    router.back();
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
        <View style={styles.buttonsContainer}>
          <Pressable style={styles.button} onPress={handleRetakePhoto}>
            <MaterialIcons name="replay" size={32} color="white" />
            <TextComponent
              type={TextType.textSmallRegular}
              style={styles.buttonText}
            >
              Tirar novamente
            </TextComponent>
          </Pressable>
          <Pressable style={styles.button} onPress={handleConfirmPhoto}>
            <MaterialIcons name="check" size={32} color="white" />
            <TextComponent
              type={TextType.textSmallRegular}
              style={styles.buttonText}
            >
              Confirmar
            </TextComponent>
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
});
