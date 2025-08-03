import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { createStyles } from "../styles/styles";
import { useTheme } from "../context/ThemeContext";
import { DeviceEventEmitter } from "react-native";

const { width, height } = Dimensions.get("window");
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const STORAGE_KEY = "@krakenballs_exercises";

function ExercisesScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isHold, setIsHold] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingExercise, setEditingExercise] = useState(null);

  useEffect(() => {
    const clearListener = DeviceEventEmitter.addListener(
      "exercisesCleared",
      () => {
        console.log("Exercises cleared event received");
        setExercises([]);
        setIsLoading(false);
      }
    );

    const dataListener = DeviceEventEmitter.addListener("dataCleared", () => {
      console.log("All data cleared event received");
      setExercises([]);
      setIsLoading(false);
    });

    return () => {
      clearListener.remove();
      dataListener.remove();
    };
  }, []);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setExercises(JSON.parse(stored));
      } else {
        const preventFlag = await AsyncStorage.getItem("@prevent_auto_create");

        if (preventFlag === "true") {
          setExercises([]);
        } else {
          setExercises([]);
        }
      }
    } catch (error) {
      console.error("Error loading exercises:", error);
      setExercises([]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveExercises = async (exercisesToSave) => {
    try {
      const jsonValue = JSON.stringify(exercisesToSave);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (error) {
      console.error("Error saving exercises:", error);
      Alert.alert("Error", "Failed to save exercises");
    }
  };

  const handleAddExercise = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter an exercise name");
      return;
    }

    let updatedExercises;

    if (editingExercise) {
      updatedExercises = exercises.map((ex) =>
        ex.id === editingExercise.id
          ? {
              ...ex,
              name: name.trim(),
              description: description.trim(),
              videoUrl: videoUrl.trim(),
              isHold,
              updatedAt: new Date().toISOString(),
            }
          : ex
      );
    } else {
      const newExercise = {
        id: Date.now().toString(),
        name: name.trim(),
        description: description.trim(),
        videoUrl: videoUrl.trim(),
        isHold,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updatedExercises = [...exercises, newExercise];
    }

    setExercises(updatedExercises);
    await saveExercises(updatedExercises);

    setModalVisible(false);
    setEditingExercise(null);
    setName("");
    setDescription("");
    setVideoUrl("");
    setIsHold(false);
  };

  const handleDeleteExercise = async (id) => {
    const updatedExercises = exercises.filter((ex) => ex.id !== id);
    setExercises(updatedExercises);
    await saveExercises(updatedExercises);
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 1,
        speed: 1,
        bounciness: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (isLoading) {
    return (
      <View
        style={[
          styles.pageWrapper,
          {
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.background,
          },
        ]}
      >
        <View style={styles.loadingContainer}>
          {[1, 2, 3].map((i) => (
            <View
              key={i}
              style={[
                styles.loadingCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
            >
              <View
                style={[styles.loadingLine, { backgroundColor: theme.border }]}
              />
              <View
                style={[
                  styles.loadingLine,
                  {
                    width: "60%",
                    backgroundColor: theme.border + "80",
                  },
                ]}
              />
            </View>
          ))}
        </View>
      </View>
    );
  }

  const renderExerciseItem = ({ item }) => (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: fadeAnim,
          marginBottom: 12,
          marginHorizontal: 16,
          backgroundColor: theme.card,
          borderColor: theme.border,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
        }}
        onPress={() => {
          setEditingExercise(item);
          setName(item.name);
          setDescription(item.description || "");
          setVideoUrl(item.videoUrl || "");
          setIsHold(item.isHold);
          setModalVisible(true);
        }}
        activeOpacity={0.7}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.text,
              {
                fontSize: 16,
                fontWeight: "600",
                color: theme.text,
                marginBottom: 4,
              },
            ]}
          >
            {item.name}
          </Text>
          {item.description ? (
            <Text
              style={[
                styles.text,
                {
                  color: theme.text + "CC",
                  fontSize: 13,
                },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.description}
            </Text>
          ) : null}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <Ionicons
              name={item.isHold ? "timer" : "fitness"}
              size={12}
              color={theme.primary}
            />
            <Text
              style={[
                styles.text,
                {
                  fontSize: 12,
                  color: theme.primary,
                  marginLeft: 4,
                },
              ]}
            >
              {item.isHold ? "Hold Exercise" : "Rep Exercise"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              marginLeft: 12,
              backgroundColor: "rgba(255, 59, 48, 0.1)",
            },
          ]}
          onPress={(e) => {
            e.stopPropagation();
            Alert.alert(
              "Delete Exercise",
              `Are you sure you want to delete "${item.name}"?`,
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => handleDeleteExercise(item.id),
                },
              ]
            );
          }}
        >
          <Ionicons name="trash" size={20} color="#ff3b30" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );

  // Empty state component
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyCircle}>
        <Ionicons name="fitness" size={32} color={theme.primary} />
      </View>
      <Text style={styles.emptyStateText}>
        No exercises yet.{"\n"}
        <Text style={styles.emptyStateHighlight}>Tap the + button</Text> to
        create your first exercise!
      </Text>
    </View>
  );

  return (
    <View style={[styles.pageWrapper, { backgroundColor: theme.background }]}>
      <Animated.View style={[{ flex: 1, opacity: fadeAnim }]}>
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingTop: 10,
            paddingBottom: 100,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={renderExerciseItem}
          ListEmptyComponent={renderEmptyState}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={() => Keyboard.dismiss()}
        />

        {/* FAB */}
        <AnimatedTouchable
          style={[
            {
              position: "absolute",
              left: 20,
              bottom: 20,
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: theme.primary,
              justifyContent: "center",
              alignItems: "center",
              elevation: 4,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              zIndex: 10,
            },
            {
              transform: [
                {
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
              ],
            },
          ]}
          onPress={() => {
            setEditingExercise(null);
            setName("");
            setDescription("");
            setVideoUrl("");
            setIsHold(false);
            setModalVisible(true);
          }}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[theme.primary, theme.primary + "DD"]}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 28,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="add" size={28} color={theme.card} />
          </LinearGradient>
        </AnimatedTouchable>
      </Animated.View>

      {/* Modal - Keep TouchableWithoutFeedback only for the modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: theme.card,
                borderRadius: 20,
                padding: 20,
                width: width * 0.9,
                maxHeight: height * 0.8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: 18,
                    fontWeight: "600",
                    marginBottom: 20,
                    textAlign: "center",
                    color: theme.text,
                  },
                ]}
              >
                {editingExercise ? "Edit Exercise" : "Add New Exercise"}
              </Text>

              <TextInput
                style={{
                  backgroundColor: theme.background,
                  borderRadius: 10,
                  padding: 15,
                  marginBottom: 15,
                  color: theme.text,
                  fontSize: 16,
                  borderWidth: 1,
                  borderColor: theme.border,
                }}
                placeholder="Exercise name"
                placeholderTextColor={theme.text + "80"}
                value={name}
                onChangeText={setName}
              />

              <TextInput
                style={{
                  backgroundColor: theme.background,
                  borderRadius: 10,
                  padding: 15,
                  marginBottom: 15,
                  color: theme.text,
                  fontSize: 16,
                  borderWidth: 1,
                  borderColor: theme.border,
                  minHeight: 80,
                  textAlignVertical: "top",
                }}
                placeholder="Description (optional)"
                placeholderTextColor={theme.text + "80"}
                value={description}
                onChangeText={setDescription}
                multiline
              />

              <TextInput
                style={{
                  backgroundColor: theme.background,
                  borderRadius: 10,
                  padding: 15,
                  marginBottom: 15,
                  color: theme.text,
                  fontSize: 16,
                  borderWidth: 1,
                  borderColor: theme.border,
                }}
                placeholder="Video URL (optional)"
                placeholderTextColor={theme.text + "80"}
                value={videoUrl}
                onChangeText={setVideoUrl}
              />

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: theme.background,
                  borderRadius: 10,
                  padding: 15,
                  marginBottom: 20,
                  borderWidth: 1,
                  borderColor: theme.border,
                }}
                onPress={() => setIsHold(!isHold)}
              >
                <Ionicons
                  name={isHold ? "checkbox" : "square-outline"}
                  size={24}
                  color={theme.primary}
                />
                <Text
                  style={[
                    styles.text,
                    {
                      marginLeft: 10,
                      color: theme.text,
                    },
                  ]}
                >
                  Hold exercise (time-based)
                </Text>
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: theme.border,
                    borderRadius: 10,
                    padding: 15,
                    flex: 1,
                    marginRight: 10,
                    alignItems: "center",
                  }}
                  onPress={() => {
                    setModalVisible(false);
                    setEditingExercise(null);
                    setName("");
                    setDescription("");
                    setVideoUrl("");
                    setIsHold(false);
                  }}
                >
                  <Text
                    style={[
                      styles.text,
                      {
                        color: theme.text,
                        fontWeight: "600",
                      },
                    ]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: theme.primary,
                    borderRadius: 10,
                    padding: 15,
                    flex: 1,
                    marginLeft: 10,
                    alignItems: "center",
                  }}
                  onPress={handleAddExercise}
                >
                  <Text
                    style={[
                      styles.text,
                      {
                        color: theme.card,
                        fontWeight: "600",
                      },
                    ]}
                  >
                    {editingExercise ? "Update" : "Add"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

export default ExercisesScreen;
