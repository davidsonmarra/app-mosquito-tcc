import React from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";

export default function RegisterScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Cadastro</Text>
      <Text style={{ fontSize: 16, marginBottom: 20, textAlign: "center" }}>
        Tela de cadastro em desenvolvimento
      </Text>
      <Pressable 
        style={{ backgroundColor: "#0a7ea4", padding: 12, borderRadius: 8 }}
        onPress={() => router.back()}
      >
        <Text style={{ color: "#fff", fontSize: 16 }}>Voltar</Text>
      </Pressable>
    </View>
  );
}
