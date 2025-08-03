import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

const ExerciseSetEditor = ({
  sets = [],
  onUpdateSets,
  isHold = false,
  minSets = 1,
  maxSets = 10,
}) => {
  const { theme } = useTheme();

  // Ensure we have a valid sets array
  const safeSets = Array.isArray(sets) ? sets : [];
  const [editingSet, setEditingSet] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [editingField, setEditingField] = useState(null);

  const updateSet = (index, field, value) => {
    const newSets = [...sets];

    // Convert to number if it's a numeric field
    const numericValue = ["reps", "weight", "timeInterval"].includes(field)
      ? parseFloat(value) || 0
      : value;

    newSets[index] = { ...newSets[index], [field]: numericValue };
    onUpdateSets(newSets);
  };

  const addSet = () => {
    if (sets.length >= maxSets) return;
    const lastSet = sets[sets.length - 1] || {
      reps: 10,
      weight: 20,
      timeInterval: 30,
    };
    onUpdateSets([...sets, { ...lastSet, id: Date.now().toString() }]);
  };

  const removeSet = (index) => {
    if (sets.length <= minSets) return;
    const newSets = sets.filter((_, i) => i !== index);
    onUpdateSets(newSets);
  };

  const startEditing = (index, field, value) => {
    setEditingSet(index);
    setEditingField(field);
    setTempValue(value?.toString() || "");
  };

  const saveEdit = () => {
    if (editingSet !== null && editingField) {
      updateSet(editingSet, editingField, tempValue);
    }
    setEditingSet(null);
    setEditingField(null);
    Keyboard.dismiss();
  };

  const themedStyles = {
    container: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      marginTop: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
      paddingHorizontal: 8,
      backgroundColor: theme.background,
      borderRadius: 8,
      paddingVertical: 10,
    },
    headerText: {
      color: theme.text + "CC",
      fontSize: 13,
      fontWeight: "600",
      textAlign: "center",
    },
    setRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
      backgroundColor: theme.background,
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    setNumber: {
      color: theme.text,
      width: 40,
      textAlign: "center",
      fontWeight: "600",
      marginRight: 10,
    },
    inputContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      height: 40,
      marginHorizontal: 2,
    },
    input: {
      color: theme.text,
      fontSize: 16,
      textAlign: "center",
      minWidth: 60,
      backgroundColor: theme.card,
      borderRadius: 6,
      padding: 8,
      borderWidth: 1,
      borderColor: theme.primary,
    },
    valueText: {
      color: theme.text,
      fontSize: 16,
    },
    removeButton: {
      width: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 12,
      borderRadius: 8,
      marginTop: 8,
      backgroundColor: theme.primary + "20",
      borderWidth: 1,
      borderColor: theme.primary + "40",
    },
    addButtonDisabled: {
      opacity: 0.5,
    },
    addButtonText: {
      color: theme.primary,
      marginLeft: 8,
      fontWeight: "600",
    },
  };

  return (
    <View style={themedStyles.container}>
      <View style={themedStyles.header}>
        <View style={{ width: 50, alignItems: "center" }}>
          <Text style={themedStyles.headerText}>Set</Text>
        </View>
        <View style={{ flex: 2, alignItems: "center" }}>
          {isHold ? (
            <Text style={themedStyles.headerText}>Time (s)</Text>
          ) : (
            <Text style={themedStyles.headerText}>Reps</Text>
          )}
        </View>
        <View style={{ flex: 2, alignItems: "center" }}>
          <Text style={themedStyles.headerText}>Weight (kg)</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {safeSets.map((set, index) => (
        <View
          key={`set-${set.id || index}-${set.reps || 0}-${set.weight || 0}-${
            set.timeInterval || 0
          }`}
          style={themedStyles.setRow}
        >
          <Text style={themedStyles.setNumber}>{index + 1}</Text>

          <TouchableOpacity
            style={themedStyles.inputContainer}
            onPress={() =>
              startEditing(
                index,
                isHold ? "timeInterval" : "reps",
                isHold ? set.timeInterval || "" : set.reps || ""
              )
            }
          >
            {editingSet === index &&
            ((isHold && editingField === "timeInterval") ||
              (!isHold && editingField === "reps")) ? (
              <TextInput
                style={themedStyles.input}
                value={tempValue}
                onChangeText={setTempValue}
                keyboardType="numeric"
                onBlur={saveEdit}
                onSubmitEditing={saveEdit}
                autoFocus
                placeholderTextColor={theme.text + "80"}
              />
            ) : (
              <Text style={themedStyles.valueText}>
                {isHold ? set.timeInterval || "0" : set.reps || "0"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={themedStyles.inputContainer}
            onPress={() => startEditing(index, "weight", set.weight)}
          >
            {editingSet === index && editingField === "weight" ? (
              <TextInput
                style={themedStyles.input}
                value={tempValue}
                onChangeText={setTempValue}
                keyboardType="numeric"
                onBlur={saveEdit}
                onSubmitEditing={saveEdit}
                autoFocus
                placeholderTextColor={theme.text + "80"}
              />
            ) : (
              <Text style={themedStyles.valueText}>{set.weight || "0"}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={themedStyles.removeButton}
            onPress={() => removeSet(index)}
            disabled={sets.length <= minSets}
          >
            <Ionicons
              name="remove-circle"
              size={24}
              color={sets.length > minSets ? "#ff3b30" : theme.text + "40"}
            />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        style={[
          themedStyles.addButton,
          safeSets.length >= maxSets && themedStyles.addButtonDisabled,
        ]}
        onPress={addSet}
        disabled={safeSets.length >= maxSets}
      >
        <Ionicons name="add-circle" size={24} color={theme.primary} />
        <Text style={themedStyles.addButtonText}>Add Set</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ExerciseSetEditor;
