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

const STORAGE_KEY = "@krakenballs_plans";

function PlanScreen({ navigation }) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const clearListener = DeviceEventEmitter.addListener("plansCleared", () => {
      console.log("Plans cleared event received");
      setPlans([]);
      setIsLoading(false);
    });

    const dataListener = DeviceEventEmitter.addListener("dataCleared", () => {
      console.log("All data cleared event received");
      setPlans([]);
      setIsLoading(false);
    });

    const updateListener = DeviceEventEmitter.addListener(
      "plansUpdated",
      () => {
        console.log("Plans updated event received");
        loadPlans(); // Refresh the plans list
      }
    );

    return () => {
      clearListener.remove();
      dataListener.remove();
      updateListener.remove();
    };
  }, []);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setIsLoading(true);
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue !== null) {
        setPlans(JSON.parse(jsonValue));
      } else {
        const preventFlag = await AsyncStorage.getItem("@prevent_auto_create");
        if (preventFlag === "true") {
          setPlans([]);
        } else {
          setPlans([]);
        }
      }
    } catch (error) {
      console.error("Error loading plans:", error);
      Alert.alert("Error", "Failed to load plans");
      setPlans([]);
    } finally {
      setIsLoading(false);
    }
  };

  const savePlans = async (plansToSave) => {
    try {
      const jsonValue = JSON.stringify(plansToSave);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (error) {
      console.error("Error saving plans:", error);
      Alert.alert("Error", "Failed to save plans");
    }
  };

  const handleDeletePlan = async (id) => {
    const updatedPlans = plans.filter((plan) => plan.id !== id);
    setPlans(updatedPlans);
    await savePlans(updatedPlans);
  };

  const navigateToPlan = (plan) => {
    navigation.navigate("ManagePlan", { plan });
  };

  const navigateToCreatePlan = () => {
    navigation.navigate("ManagePlan");
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

  const renderPlanItem = ({ item }) => {
    const exerciseCount = item.exercises ? item.exercises.length : 0;

    // Fixed calculation for total sets
    const totalSets = item.exercises
      ? item.exercises.reduce((sum, exercise) => {
          // Handle different possible data structures
          if (exercise.sets && Array.isArray(exercise.sets)) {
            // If sets is an array, count the length
            return sum + exercise.sets.length;
          } else if (typeof exercise.sets === "number") {
            // If sets is a number, add it directly
            return sum + exercise.sets;
          } else if (
            exercise.setCount &&
            typeof exercise.setCount === "number"
          ) {
            // Alternative property name
            return sum + exercise.setCount;
          } else {
            // Default to 0 if no valid sets data
            return sum;
          }
        }, 0)
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
          onPress={() => navigateToPlan(item)}
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
                    marginBottom: 8,
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
              }}
            >
              <Ionicons name="fitness" size={12} color={theme.primary} />
              <Text
                style={[
                  styles.text,
                  {
                    fontSize: 12,
                    color: theme.primary,
                    marginLeft: 4,
                    marginRight: 12,
                  },
                ]}
              >
                {exerciseCount} exercise{exerciseCount !== 1 ? "s" : ""}
              </Text>
              <Ionicons name="layers" size={12} color={theme.primary} />
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
                {totalSets} set{totalSets !== 1 ? "s" : ""}
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
                "Delete Plan",
                `Are you sure you want to delete "${item.name}"?`,
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => handleDeletePlan(item.id),
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
        <Ionicons name="clipboard" size={32} color={theme.primary} />
      </View>
      <Text style={styles.emptyStateText}>
        No workout plans yet.{"\n"}
        <Text style={styles.emptyStateHighlight}>Tap the + button</Text> to
        create your first plan!
      </Text>
    </View>
  );

  return (
    <View style={[styles.pageWrapper, { backgroundColor: theme.background }]}>
      <Animated.View style={[{ flex: 1, opacity: fadeAnim }]}>
        <FlatList
          data={plans}
          keyExtractor={(item) => item.id}
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingTop: 10,
            paddingBottom: 100,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={renderPlanItem}
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
          onPress={navigateToCreatePlan}
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

export default PlanScreen;
