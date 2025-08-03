import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Animated,
  Dimensions,
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

const STORAGE_KEY = "@krakenballs_programs";

function ProgramScreen({ navigation }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const clearListener = DeviceEventEmitter.addListener(
      "programsCleared",
      () => {
        console.log("Programs cleared event received");
        setPrograms([]);
        setIsLoading(false);
      }
    );

    const dataListener = DeviceEventEmitter.addListener("dataCleared", () => {
      console.log("All data cleared event received");
      setPrograms([]);
      setIsLoading(false);
    });

    const updateListener = DeviceEventEmitter.addListener(
      "programsUpdated",
      () => {
        console.log("Programs updated event received");
        loadPrograms(); // Refresh the programs list
      }
    );

    return () => {
      clearListener.remove();
      dataListener.remove();
      updateListener.remove();
    };
  }, []);

  // Load programs from AsyncStorage on component mount
  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      setIsLoading(true);
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue !== null) {
        setPrograms(JSON.parse(jsonValue));
      } else {
        const preventFlag = await AsyncStorage.getItem("@prevent_auto_create");
        if (preventFlag === "true") {
          setPrograms([]);
        } else {
          setPrograms([]);
        }
      }
    } catch (error) {
      console.error("Error loading programs:", error);
      Alert.alert("Error", "Failed to load programs");
      setPrograms([]);
    } finally {
      setIsLoading(false);
    }
  };

  const savePrograms = async (programsToSave) => {
    try {
      const jsonValue = JSON.stringify(programsToSave);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (error) {
      console.error("Error saving programs:", error);
      Alert.alert("Error", "Failed to save programs");
    }
  };

  const handleDeleteProgram = async (id) => {
    const updatedPrograms = programs.filter((program) => program.id !== id);
    setPrograms(updatedPrograms);
    await savePrograms(updatedPrograms);
  };

  const handleToggleActive = async (id) => {
    const updatedPrograms = programs.map((program) =>
      program.id === id ? { ...program, isActive: !program.isActive } : program
    );
    setPrograms(updatedPrograms);
    await savePrograms(updatedPrograms);
  };

  const navigateToProgram = (program) => {
    navigation.navigate("ProgramManager", { program });
  };

  const navigateToCreateProgram = () => {
    navigation.navigate("ProgramManager");
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

  const renderProgramItem = ({ item }) => {
    const cycleDays = item.cycleDays || 0;
    const totalDays = item.totalDays || 0;
    const assignedPlans = item.days
      ? item.days.filter((day) => day.planId).length
      : 0;

    return (
      <Animated.View
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            marginBottom: 12,
            marginHorizontal: 16,
            backgroundColor: theme.card,
            borderColor: theme.border,
            borderLeftWidth: 4,
            borderLeftColor: item.isActive ? "#4CAF50" : "#666",
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
          onPress={() => navigateToProgram(item)}
          activeOpacity={0.7}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: 16,
                    fontWeight: "600",
                    color: theme.text,
                    flex: 1,
                  },
                ]}
              >
                {item.name}
              </Text>
            </View>

            {item.description ? (
              <Text
                style={[
                  styles.text,
                  {
                    color: theme.text + "CC",
                    fontSize: 13,
                    marginBottom: 12,
                  },
                ]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item.description}
              </Text>
            ) : null}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: 12,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons name="calendar" size={12} color={theme.primary} />
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
                  {cycleDays} day cycle
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons name="time" size={12} color={theme.primary} />
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
                  {totalDays} total days
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="clipboard" size={12} color={theme.primary} />
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
                  {assignedPlans}/{cycleDays} plans assigned
                </Text>
              </View>
            </View>

            {/* Enhanced Active/Inactive Button */}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 10,
                paddingHorizontal: 16,
                borderRadius: 20,
                backgroundColor: item.isActive ? "#4CAF50" : "#666",
                shadowColor: item.isActive ? "#4CAF50" : "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: item.isActive ? 0.3 : 0.1,
                shadowRadius: 4,
                elevation: item.isActive ? 3 : 1,
                marginTop: 4,
              }}
              onPress={(e) => {
                e.stopPropagation();
                handleToggleActive(item.id);
              }}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  item.isActive ? ["#4CAF50", "#45a049"] : ["#666", "#555"]
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 2,
                  paddingHorizontal: 4,
                  borderRadius: 18,
                  minWidth: 100,
                }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#fff",
                    marginRight: 8,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 1,
                    elevation: 1,
                  }}
                />
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {item.isActive ? "ACTIVE" : "INACTIVE"}
                </Text>
                {item.isActive && (
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color="#fff"
                    style={{ marginLeft: 6 }}
                  />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                marginLeft: 16,
                backgroundColor: "rgba(255, 59, 48, 0.1)",
                width: 44,
                height: 44,
                borderRadius: 22,
              },
            ]}
            onPress={(e) => {
              e.stopPropagation();
              Alert.alert(
                "Delete Program",
                `Are you sure you want to delete "${item.name}"?`,
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => handleDeleteProgram(item.id),
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
  };

  // Empty state component
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyCircle}>
        <Ionicons name="list" size={32} color={theme.primary} />
      </View>
      <Text style={styles.emptyStateText}>
        No programs yet.{"\n"}
        <Text style={styles.emptyStateHighlight}>Tap the + button</Text> to
        create your first program!
      </Text>
    </View>
  );

  return (
    <View style={[styles.pageWrapper, { backgroundColor: theme.background }]}>
      <Animated.View style={[{ flex: 1, opacity: fadeAnim }]}>
        <FlatList
          data={programs}
          keyExtractor={(item) => item.id}
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingTop: 10,
            paddingBottom: 100,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={renderProgramItem}
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
          onPress={navigateToCreateProgram}
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
    </View>
  );
}

export default ProgramScreen;
