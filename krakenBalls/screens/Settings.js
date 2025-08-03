import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DeviceEventEmitter } from "react-native";

const THEMES = {
  dark: {
    name: "Dark",
    icon: "moon",
    iconType: "ionicons",
    colors: {
      primary: "#4CAF50",
      background: "#0a0a0a",
      card: "#1a1a1a",
      text: "#ffffff",
      border: "#333333",
      notification: "#ff3b30",
    },
  },
  Phub: {
    name: "Phub",
    icon: "car",
    iconType: "material",
    colors: {
      primary: "#f37c23",
      background: "#0a0a0a",
      card: "#181818",
      text: "#ffffff",
      border: "#333333",
      notification: "#ff3b30",
    },
  },
  light: {
    name: "Light",
    icon: "sunny",
    iconType: "ionicons",
    colors: {
      primary: "#4CAF50",
      background: "#f5f5f5",
      card: "#ffffff",
      text: "#1a1b26",
      border: "#e0e0e0",
      notification: "#ff3b30",
    },
  },
  ocean: {
    name: "Ocean",
    icon: "water",
    iconType: "ionicons",
    colors: {
      primary: "#2196F3",
      background: "#0a1929",
      card: "#132f4c",
      text: "#e6f4ff",
      border: "#1e4976",
      notification: "#ff3b30",
    },
  },
  sunset: {
    name: "Sunset",
    icon: "partly-sunny",
    iconType: "ionicons",
    colors: {
      primary: "#FF6B35",
      background: "#1a0f0a",
      card: "#2d1b16",
      text: "#fff5f0",
      border: "#4a2c1a",
      notification: "#ff3b30",
    },
  },
  forest: {
    name: "Forest",
    icon: "leaf",
    iconType: "ionicons",
    colors: {
      primary: "#8BC34A",
      background: "#0d1b0d",
      card: "#1a2e1a",
      text: "#f0fff0",
      border: "#2d4a2d",
      notification: "#ff3b30",
    },
  },
  purple: {
    name: "Purple",
    icon: "diamond",
    iconType: "ionicons",
    colors: {
      primary: "#9C27B0",
      background: "#1a0d1a",
      card: "#2e1a2e",
      text: "#f5f0f5",
      border: "#4a2d4a",
      notification: "#ff3b30",
    },
  },
  cyberpunk: {
    name: "Cyberpunk",
    icon: "flash",
    iconType: "ionicons",
    colors: {
      primary: "#00FFFF",
      background: "#0a0a0f",
      card: "#1a1a2e",
      text: "#00ff41",
      border: "#16213e",
      notification: "#ff0080",
    },
  },
  minimal: {
    name: "Minimal",
    icon: "square-outline",
    iconType: "ionicons",
    colors: {
      primary: "#666666",
      background: "#fafafa",
      card: "#ffffff",
      text: "#2c2c2c",
      border: "#eeeeee",
      notification: "#ff3b30",
    },
  },
  midnight: {
    name: "Midnight",
    icon: "moon-outline",
    iconType: "ionicons",
    colors: {
      primary: "#7C4DFF",
      background: "#000000",
      card: "#121212",
      text: "#ffffff",
      border: "#2a2a2a",
      notification: "#ff3b30",
    },
  },
  coral: {
    name: "Coral",
    icon: "heart",
    iconType: "ionicons",
    colors: {
      primary: "#FF5722",
      background: "#fff8f6",
      card: "#ffffff",
      text: "#3e2723",
      border: "#ffccbc",
      notification: "#d32f2f",
    },
  },
  arctic: {
    name: "Arctic",
    icon: "snow",
    iconType: "ionicons",
    colors: {
      primary: "#00BCD4",
      background: "#f0f8ff",
      card: "#ffffff",
      text: "#2c3e50",
      border: "#b3d9ff",
      notification: "#ff3b30",
    },
  },
  volcano: {
    name: "Volcano",
    icon: "flame",
    iconType: "ionicons",
    colors: {
      primary: "#FFD700",
      background: "#2d0a0a",
      card: "#4a1515",
      text: "#ffe4b5",
      border: "#8b2635",
      notification: "#ff8c00",
    },
  },
  lavender: {
    name: "Lavender",
    icon: "flower",
    iconType: "ionicons",
    colors: {
      primary: "#8E44AD",
      background: "#f8f5ff",
      card: "#ffffff",
      text: "#4a148c",
      border: "#e1bee7",
      notification: "#e91e63",
    },
  },
  neon: {
    name: "Neon",
    icon: "lightbulb-outline",
    iconType: "material",
    colors: {
      primary: "#39FF14",
      background: "#0d0d0d",
      card: "#1a1a1a",
      text: "#39ff14",
      border: "#ff1493",
      notification: "#ff073a",
    },
  },
  desert: {
    name: "Desert",
    icon: "weather-sunny",
    iconType: "material",
    colors: {
      primary: "#D2691E",
      background: "#2d1b0a",
      card: "#3d2817",
      text: "#f4e4bc",
      border: "#8b4513",
      notification: "#dc143c",
    },
  },
  emerald: {
    name: "Emerald",
    icon: "diamond-stone",
    iconType: "material",
    colors: {
      primary: "#50C878",
      background: "#0f1a0f",
      card: "#1e3a1e",
      text: "#b8f2b8",
      border: "#2d5a2d",
      notification: "#ff6b6b",
    },
  },
  galaxy: {
    name: "Galaxy",
    icon: "earth",
    iconType: "material",
    colors: {
      primary: "#6A0DAD",
      background: "#0b0b1f",
      card: "#1a1a3a",
      text: "#e6e6fa",
      border: "#483d8b",
      notification: "#ff1493",
    },
  },
  autumn: {
    name: "Autumn",
    icon: "leaf-maple",
    iconType: "material",
    colors: {
      primary: "#CD853F",
      background: "#2d1a0a",
      card: "#3d2817",
      text: "#ffeaa7",
      border: "#8b4513",
      notification: "#d63031",
    },
  },
  ice: {
    name: "Ice",
    icon: "snowflake",
    iconType: "material",
    colors: {
      primary: "#4FC3F7",
      background: "#e8f4fd",
      card: "#f5faff",
      text: "#0d47a1",
      border: "#90caf9",
      notification: "#1976d2",
    },
  },
  cherry: {
    name: "Cherry",
    icon: "food-apple",
    iconType: "material",
    colors: {
      primary: "#DC143C",
      background: "#fff0f5",
      card: "#ffffff",
      text: "#8b0000",
      border: "#ffb6c1",
      notification: "#b22222",
    },
  },
  matrix: {
    name: "Matrix",
    icon: "matrix",
    iconType: "material",
    colors: {
      primary: "#00FF00",
      background: "#000000",
      card: "#0a0a0a",
      text: "#00ff00",
      border: "#003300",
      notification: "#ff0000",
    },
  },
  rose: {
    name: "Rose",
    icon: "flower-tulip",
    iconType: "material",
    colors: {
      primary: "#FF69B4",
      background: "#fff5f8",
      card: "#ffffff",
      text: "#8b008b",
      border: "#ffc0cb",
      notification: "#dc143c",
    },
  },
  steel: {
    name: "Steel",
    icon: "iron",
    iconType: "material",
    colors: {
      primary: "#708090",
      background: "#2f2f2f",
      card: "#404040",
      text: "#dcdcdc",
      border: "#696969",
      notification: "#ff6347",
    },
  },
  tropical: {
    name: "Tropical",
    icon: "palm-tree",
    iconType: "material",
    colors: {
      primary: "#FF6347",
      background: "#fff8f0",
      card: "#fffaf5",
      text: "#8b4513",
      border: "#ffd4a3",
      notification: "#ff4500",
    },
  },
  vintage: {
    name: "Vintage",
    icon: "camera",
    iconType: "ionicons",
    colors: {
      primary: "#8B4513",
      background: "#faf0e6",
      card: "#fff8dc",
      text: "#654321",
      border: "#deb887",
      notification: "#cd5c5c",
    },
  },
};

const SettingsItem = ({
  title,
  description,
  children,
  onPress,
  isDropdownOpen,
  showChevron = true,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.item, { backgroundColor: theme.card + "20" }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.itemContent}>
        <Text style={[styles.itemTitle, { color: theme.text }]}>{title}</Text>
        {description && (
          <Text style={[styles.itemDescription, { color: theme.text + "AA" }]}>
            {description}
          </Text>
        )}
      </View>
      <View style={styles.itemRightContent}>
        {children}
        {showChevron && (
          <Ionicons
            name={isDropdownOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color={theme.text + "CC"}
            style={styles.dropdownIcon}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const ThemeIcon = ({ themeInfo, size = 16, color }) => {
  const IconComponent =
    themeInfo.iconType === "material" ? MaterialCommunityIcons : Ionicons;
  return <IconComponent name={themeInfo.icon} size={size} color={color} />;
};

const ThemeOption = ({ themeKey, isSelected, onSelect }) => {
  const { theme: currentTheme } = useTheme();
  const themeInfo = THEMES[themeKey];

  return (
    <TouchableOpacity
      style={[
        styles.themeOption,
        {
          backgroundColor: isSelected
            ? currentTheme.primary + "15"
            : "transparent",
          borderLeftWidth: isSelected ? 3 : 0,
          borderLeftColor: currentTheme.primary,
        },
      ]}
      onPress={() => onSelect(themeKey)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.themePreview,
          {
            backgroundColor: themeInfo.colors.background,
            borderColor: themeInfo.colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.themeAccent,
            { backgroundColor: themeInfo.colors.primary },
          ]}
        />
        <ThemeIcon
          themeInfo={themeInfo}
          size={14}
          color={themeInfo.colors.primary}
        />
      </View>
      <View style={styles.themeInfo}>
        <Text style={[styles.themeName, { color: currentTheme.text }]}>
          {themeInfo.name}
        </Text>
        <Text
          style={[styles.themeDescription, { color: currentTheme.text + "80" }]}
        >
          {themeInfo.colors.primary}
        </Text>
      </View>
      {isSelected && (
        <View
          style={[
            styles.selectedIndicator,
            { backgroundColor: currentTheme.primary },
          ]}
        >
          <Ionicons name="checkmark" size={14} color={currentTheme.card} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const DebugScreen = ({ theme, onClose }) => {
  const [storageData, setStorageData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAllStorageData();
  }, []);

  const loadAllStorageData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const stores = await AsyncStorage.multiGet(keys);

      const data = {};
      stores.forEach(([key, value]) => {
        try {
          data[key] = JSON.parse(value);
        } catch (e) {
          data[key] = value; // If it's not JSON, store as string
        }
      });

      setStorageData(data);
    } catch (error) {
      console.error("Error loading storage data:", error);
      Alert.alert("Error", "Failed to load storage data");
    } finally {
      setIsLoading(false);
    }
  };

  const clearAllData = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to clear all app data? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              // Get all keys first
              const keys = await AsyncStorage.getAllKeys();
              console.log("Keys before clearing:", keys);

              // Clear all storage
              await AsyncStorage.clear();

              // Set a flag to prevent auto-recreation of default data
              await AsyncStorage.setItem("@prevent_auto_create", "true");

              // Wait a bit to ensure clearing is complete
              await new Promise((resolve) => setTimeout(resolve, 100));

              // Verify clearing worked
              const remainingKeys = await AsyncStorage.getAllKeys();
              console.log("Keys after clearing:", remainingKeys);

              // Update local state
              setStorageData({ "@prevent_auto_create": "true" });

              // Emit events to notify other screens to refresh their data
              DeviceEventEmitter.emit("dataCleared");
              DeviceEventEmitter.emit("exercisesCleared");
              DeviceEventEmitter.emit("plansCleared");

              Alert.alert(
                "Success",
                "All data cleared successfully. Other screens will refresh automatically.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      onClose();
                    },
                  },
                ]
              );
            } catch (error) {
              console.error("Clear error:", error);
              Alert.alert("Error", `Failed to clear data: ${error.message}`);
            }
          },
        },
      ]
    );
  };

  const clearSpecificKey = (key) => {
    Alert.alert("Clear Item", `Are you sure you want to delete "${key}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem(key);
            await loadAllStorageData(); // Refresh the data

            // Emit specific events based on what was deleted
            if (key === "@krakenballs_exercises") {
              DeviceEventEmitter.emit("exercisesCleared");
            } else if (key === "@krakenballs_plans") {
              DeviceEventEmitter.emit("plansCleared");
            }

            Alert.alert("Success", `"${key}" deleted`);
          } catch (error) {
            Alert.alert("Error", `Failed to delete "${key}"`);
          }
        },
      },
    ]);
  };

  const formatValue = (value) => {
    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const getValuePreview = (value) => {
    const formatted = formatValue(value);
    if (formatted.length > 100) {
      return formatted.substring(0, 100) + "...";
    }
    return formatted;
  };

  return (
    <View
      style={[styles.debugContainer, { backgroundColor: theme.background }]}
    >
      <View
        style={[
          styles.debugHeader,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <Text style={[styles.debugTitle, { color: theme.text }]}>
          Debug - AsyncStorage
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.debugContent}>
        {isLoading ? (
          <Text style={[styles.debugText, { color: theme.text }]}>
            Loading...
          </Text>
        ) : Object.keys(storageData).length === 0 ? (
          <Text style={[styles.debugText, { color: theme.text }]}>
            No data in storage
          </Text>
        ) : (
          <>
            <Text style={[styles.debugInfo, { color: theme.text }]}>
              Found {Object.keys(storageData).length} items in storage
            </Text>
            {Object.entries(storageData).map(([key, value]) => (
              <View
                key={key}
                style={[
                  styles.debugItem,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <View style={styles.debugItemHeader}>
                  <Text style={[styles.debugKey, { color: theme.primary }]}>
                    {key}
                  </Text>
                  <TouchableOpacity
                    onPress={() => clearSpecificKey(key)}
                    style={styles.deleteKeyButton}
                  >
                    <Ionicons name="trash-outline" size={16} color="#ff3b30" />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.debugValue, { color: theme.text }]}>
                  {getValuePreview(value)}
                </Text>
                {formatValue(value).length > 100 && (
                  <TouchableOpacity
                    onPress={() => Alert.alert(key, formatValue(value))}
                    style={styles.expandButton}
                  >
                    <Text style={[styles.expandText, { color: theme.primary }]}>
                      Tap to view full content
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </>
        )}
      </ScrollView>

      <View
        style={[
          styles.debugActions,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <TouchableOpacity
          style={[styles.debugButton, { backgroundColor: theme.primary }]}
          onPress={loadAllStorageData}
        >
          <Ionicons name="refresh" size={20} color={theme.card} />
          <Text style={[styles.debugButtonText, { color: theme.card }]}>
            Refresh
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.debugButton, { backgroundColor: "#ff3b30" }]}
          onPress={clearAllData}
        >
          <Ionicons name="trash" size={20} color="white" />
          <Text style={[styles.debugButtonText, { color: "white" }]}>
            Clear All
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

function SettingsScreen({ navigation }) {
  const { theme, setTheme } = useTheme();
  const [showThemeOptions, setShowThemeOptions] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("dark");
  const dropdownAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(dropdownAnim, {
      toValue: showThemeOptions ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [showThemeOptions]);

  const handleThemeSelect = (themeKey) => {
    setCurrentTheme(themeKey);
    setTheme({ ...THEMES[themeKey].colors, name: THEMES[themeKey].name });
    setShowThemeOptions(false);
  };

  // Calculate actual dropdown height based on number of themes
  const themeCount = Object.keys(THEMES).length;
  const itemHeight = 60; // Height of each theme option
  const maxVisibleItems = 6; // Maximum items to show before scrolling
  const actualDropdownHeight =
    Math.min(themeCount, maxVisibleItems) * itemHeight;

  const dropdownHeight = dropdownAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, actualDropdownHeight],
  });

  const dropdownOpacity = dropdownAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  if (showDebug) {
    return <DebugScreen theme={theme} onClose={() => setShowDebug(false)} />;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.section,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>
          Appearance
        </Text>
        <SettingsItem
          title="Theme"
          description={`Current: ${THEMES[currentTheme]?.name || "System"}`}
          onPress={() => setShowThemeOptions(!showThemeOptions)}
          isDropdownOpen={showThemeOptions}
        >
          <View style={styles.currentThemeIndicator}>
            <ThemeIcon
              themeInfo={THEMES[currentTheme]}
              size={18}
              color={theme.primary}
            />
          </View>
        </SettingsItem>

        <Animated.View
          style={[
            styles.dropdownContainer,
            {
              height: dropdownHeight,
              opacity: dropdownOpacity,
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <ScrollView
            style={styles.dropdownScroll}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            {showThemeOptions &&
              Object.entries(THEMES).map(([key, themeInfo]) => (
                <ThemeOption
                  key={key}
                  themeKey={key}
                  isSelected={currentTheme === key}
                  onSelect={handleThemeSelect}
                />
              ))}
          </ScrollView>
        </Animated.View>
      </View>

      <View
        style={[
          styles.section,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>
          Developer
        </Text>
        <SettingsItem
          title="Debug Storage"
          description="View AsyncStorage contents"
          onPress={() => setShowDebug(true)}
          showChevron={false}
        >
          <Ionicons name="bug" size={20} color={theme.primary} />
        </SettingsItem>
      </View>

      <View
        style={[
          styles.section,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>
          About
        </Text>
        <SettingsItem title="Version" description="0.2.2" showChevron={false} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    borderRadius: 16,
    margin: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  itemContent: {
    flex: 1,
  },
  itemRightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 13,
  },
  currentThemeIndicator: {
    marginRight: 8,
    padding: 4,
  },
  dropdownIcon: {
    marginLeft: 8,
  },
  dropdownContainer: {
    overflow: "hidden",
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
  },
  dropdownScroll: {
    flex: 1,
  },
  themeOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    height: 60,
  },
  themePreview: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 2,
    position: "relative",
  },
  themeAccent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 6,
  },
  themeInfo: {
    flex: 1,
  },
  themeName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  themeDescription: {
    fontSize: 12,
    fontFamily: "monospace",
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  // Debug Screen Styles
  debugContainer: {
    flex: 1,
  },
  debugHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
  },
  debugTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    padding: 4,
  },
  debugContent: {
    flex: 1,
    padding: 16,
  },
  debugText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
  },
  debugInfo: {
    fontSize: 14,
    marginBottom: 16,
    fontStyle: "italic",
  },
  debugItem: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  debugItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  debugKey: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  deleteKeyButton: {
    padding: 4,
  },
  debugValue: {
    fontSize: 12,
    fontFamily: "monospace",
  },
  expandButton: {
    marginTop: 8,
    alignSelf: "flex-start",
  },
  expandText: {
    fontSize: 12,
    fontStyle: "italic",
  },
  debugActions: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  debugButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  debugButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default SettingsScreen;
