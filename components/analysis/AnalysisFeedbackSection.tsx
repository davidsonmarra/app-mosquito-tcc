import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useThemeColor } from "../../hooks/useThemeColor";
import { FeedbackService } from "../../services/feedback";

interface AnalysisFeedbackSectionProps {
  feedback: {
    like: boolean | null;
    comment: string | null;
  };
  analysisId: number;
  onFeedbackChange?: (like: boolean, comment: string) => void;
}

export default function AnalysisFeedbackSection({
  feedback,
  analysisId,
  onFeedbackChange,
}: AnalysisFeedbackSectionProps) {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");

  const [currentLike, setCurrentLike] = useState<boolean | null>(feedback.like);
  const [currentComment, setCurrentComment] = useState<string>(
    feedback.comment || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(feedback.like !== null);
  const [showCommentStep, setShowCommentStep] = useState(false);

  // Sincronizar estado interno quando as props mudarem
  useEffect(() => {
    setCurrentLike(feedback.like);
    setCurrentComment(feedback.comment || "");
    setIsSubmitted(feedback.like !== null);
  }, [feedback.like, feedback.comment]);

  const handleLikePress = (like: boolean) => {
    if (isSubmitted || isSubmitting) {
      return; // Não permite mudança se já foi enviado
    }

    setCurrentLike(like);
    setShowCommentStep(true);
  };

  const handleSubmitFeedback = async () => {
    if (isSubmitted || isSubmitting || currentLike === null) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Enviar feedback para o backend
      const response = await FeedbackService.submitFeedback(
        analysisId,
        currentLike,
        currentComment
      );

      if (response.success) {
        setIsSubmitted(true);
        setShowCommentStep(false);
        onFeedbackChange?.(currentLike, currentComment);

        Alert.alert(
          "Feedback Enviado!",
          "Sua avaliação foi registrada com sucesso.",
          [{ text: "OK" }]
        );
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
      Alert.alert(
        "Erro",
        error instanceof Error
          ? error.message
          : "Não foi possível enviar o feedback. Tente novamente.",
        [{ text: "OK" }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelFeedback = () => {
    setCurrentLike(null);
    setShowCommentStep(false);
    setCurrentComment("");
  };

  const getFeedbackIcon = (like: boolean | null) => {
    if (like === true) return "thumb-up";
    if (like === false) return "thumb-down";
    return "help-outline";
  };

  const getFeedbackColor = (like: boolean | null) => {
    if (like === true) return "#4CAF50";
    if (like === false) return "#F44336";
    return "#9E9E9E";
  };

  const getFeedbackText = (like: boolean | null) => {
    if (like === true) return "Sim";
    if (like === false) return "Não";
    return "Avalie a análise";
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>
        💬 Feedback da Análise
      </Text>

      <View style={styles.feedbackContainer}>
        {/* Satisfação */}
        <View style={styles.satisfactionContainer}>
          <Text style={[styles.satisfactionLabel, { color: textColor }]}>
            Análise foi satisfatória?
          </Text>

          {/* Botões de Avaliação */}
          {!isSubmitted ? (
            <View style={styles.ratingButtons}>
              <Pressable
                style={[
                  styles.ratingButton,
                  currentLike === true && styles.ratingButtonActive,
                  { borderColor: currentLike === true ? "#4CAF50" : "#E5E5E5" },
                  isSubmitting && styles.ratingButtonDisabled,
                ]}
                onPress={() => handleLikePress(true)}
                disabled={isSubmitting}
              >
                <MaterialIcons
                  name="thumb-up"
                  size={20}
                  color={currentLike === true ? "#4CAF50" : "#9E9E9E"}
                />
                <Text
                  style={[
                    styles.ratingButtonText,
                    { color: currentLike === true ? "#4CAF50" : "#9E9E9E" },
                  ]}
                >
                  Sim
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.ratingButton,
                  currentLike === false && styles.ratingButtonActive,
                  {
                    borderColor: currentLike === false ? "#F44336" : "#E5E5E5",
                  },
                  isSubmitting && styles.ratingButtonDisabled,
                ]}
                onPress={() => handleLikePress(false)}
                disabled={isSubmitting}
              >
                <MaterialIcons
                  name="thumb-down"
                  size={20}
                  color={currentLike === false ? "#F44336" : "#9E9E9E"}
                />
                <Text
                  style={[
                    styles.ratingButtonText,
                    { color: currentLike === false ? "#F44336" : "#9E9E9E" },
                  ]}
                >
                  Não
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.submittedContainer}>
              <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
              <Text style={[styles.submittedText, { color: textColor }]}>
                Avaliação enviada com sucesso!
              </Text>
            </View>
          )}

          {/* Status Atual */}
          <View style={styles.currentStatus}>
            <MaterialIcons
              name={getFeedbackIcon(currentLike)}
              size={16}
              color={getFeedbackColor(currentLike)}
            />
            <Text
              style={[
                styles.currentStatusText,
                { color: getFeedbackColor(currentLike) },
              ]}
            >
              {getFeedbackText(currentLike)}
            </Text>
          </View>
        </View>

        {/* Comentário */}
        {(showCommentStep || isSubmitted) && (
          <View style={styles.commentContainer}>
            <Text style={[styles.commentLabel, { color: textColor }]}>
              Comentário:
            </Text>

            {!isSubmitted ? (
              <>
                <TextInput
                  style={[
                    styles.commentInput,
                    {
                      backgroundColor: backgroundColor,
                      borderColor: "#E5E5E5",
                      color: textColor,
                    },
                  ]}
                  value={currentComment}
                  onChangeText={setCurrentComment}
                  placeholder="Digite seu comentário sobre a análise..."
                  placeholderTextColor="#9E9E9E"
                  multiline
                  numberOfLines={3}
                  editable={!isSubmitting}
                />

                {/* Botões de Confirmação */}
                <View style={styles.confirmationButtons}>
                  <Pressable
                    style={[styles.confirmButton, styles.cancelButton]}
                    onPress={handleCancelFeedback}
                    disabled={isSubmitting}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.confirmButton,
                      styles.submitButton,
                      isSubmitting && styles.ratingButtonDisabled,
                    ]}
                    onPress={handleSubmitFeedback}
                    disabled={isSubmitting}
                  >
                    <Text style={styles.submitButtonText}>
                      {isSubmitting ? "Enviando..." : "Confirmar"}
                    </Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <View style={[styles.commentBox, { backgroundColor: "#f8f9fa" }]}>
                <Text style={[styles.commentText, { color: textColor }]}>
                  {currentComment || "Nenhum comentário"}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  feedbackContainer: {
    gap: 16,
  },
  satisfactionContainer: {
    alignItems: "center",
    gap: 16,
  },
  satisfactionLabel: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  ratingButtons: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },
  ratingButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    gap: 6,
    minWidth: 80,
    justifyContent: "center",
  },
  ratingButtonActive: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  ratingButtonDisabled: {
    opacity: 0.5,
  },
  ratingButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  submittedContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
  },
  submittedText: {
    fontSize: 16,
    fontWeight: "500",
  },
  confirmationButtons: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    marginTop: 16,
  },
  confirmButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  submitButton: {
    backgroundColor: "#007AFF",
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "white",
  },
  currentStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  currentStatusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  commentContainer: {
    gap: 8,
  },
  commentLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  commentInput: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 14,
    textAlignVertical: "top",
    minHeight: 80,
  },
  commentBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
