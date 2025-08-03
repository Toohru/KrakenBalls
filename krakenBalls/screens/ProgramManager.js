import React, { useState, useEffect, useRef } from 'react';
import {
View,
Text,
TextInput,
TouchableOpacity,
ScrollView,
Alert,
Modal,
FlatList,
Animated,
Keyboard,
TouchableWithoutFeedback,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { createStyles } from '../styles/styles';
import { useTheme } from '../context/ThemeContext';
import { DeviceEventEmitter } from 'react-native';

const PROGRAMS_STORAGE_KEY = '@krakenballs_programs';
const PLANS_STORAGE_KEY = '@krakenballs_plans';

function ProgramManager({ navigation, route }) {
const { theme } = useTheme();
const styles = createStyles(theme);
const { program } = route.params || {};
const isEditing = !!program;

const [programName, setProgramName] = useState(program?.name || '');
const [description, setDescription] = useState(program?.description || '');
const [cycleDays, setCycleDays] = useState(program?.cycleDays?.toString() || '');
const [totalDays, setTotalDays] = useState(program?.totalDays?.toString() || '');
const [days, setDays] = useState(program?.days || []);
const [availablePlans, setAvailablePlans] = useState([]);
const [showPlanModal, setShowPlanModal] = useState(false);
const [selectedDayIndex, setSelectedDayIndex] = useState(null);

const fadeAnim = useRef(new Animated.Value(0)).current;


useEffect(() => {
  loadAvailablePlans();
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 300,
    useNativeDriver: true,
  }).start();
}, []);

useEffect(() => {
  if (cycleDays && parseInt(cycleDays) > 0) {
    const numDays = parseInt(cycleDays);
    const newDays = [];
    
    for (let i = 0; i < numDays; i++) {
      const existingDay = days[i];
      newDays.push({
        dayNumber: i + 1,
        planId: existingDay?.planId || null,
        planName: existingDay?.planName || null,
        isRestDay: existingDay?.isRestDay || false,
      });
    }
    
    setDays(newDays);
  }
}, [cycleDays]);

const loadAvailablePlans = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(PLANS_STORAGE_KEY);
    if (jsonValue !== null) {
      setAvailablePlans(JSON.parse(jsonValue));
    }
  } catch (error) {
    console.error('Error loading plans:', error);
  }
};

const handleSaveProgram = async () => {
  if (!programName.trim()) {
    Alert.alert('Error', 'Please enter a program name');
    return;
  }

  if (!cycleDays || parseInt(cycleDays) <= 0) {
    Alert.alert('Error', 'Please enter a valid number of cycle days');
    return;
  }

  if (!totalDays || parseInt(totalDays) <= 0) {
    Alert.alert('Error', 'Please enter a valid number of total days');
    return;
  }

  try {
    const existingPrograms = await AsyncStorage.getItem(PROGRAMS_STORAGE_KEY);
    let programs = existingPrograms ? JSON.parse(existingPrograms) : [];

    const programData = {
      id: program?.id || Date.now().toString(),
      name: programName.trim(),
      description: description.trim(),
      cycleDays: parseInt(cycleDays),
      totalDays: parseInt(totalDays),
      days: days,
      isActive: program?.isActive || false,
      createdAt: program?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isEditing) {
      programs = programs.map(p => p.id === program.id ? programData : p);
    } else {
      programs.push(programData);
    }

    await AsyncStorage.setItem(PROGRAMS_STORAGE_KEY, JSON.stringify(programs));
    DeviceEventEmitter.emit('programsUpdated');
    
    Alert.alert(
      'Success',
      `Program ${isEditing ? 'updated' : 'created'} successfully!`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  } catch (error) {
    console.error('Error saving program:', error);
    Alert.alert('Error', 'Failed to save program');
  }
};

const handleSelectPlan = (plan) => {
  if (selectedDayIndex !== null) {
    const updatedDays = [...days];
    updatedDays[selectedDayIndex] = {
      ...updatedDays[selectedDayIndex],
      planId: plan.id,
      planName: plan.name,
      isRestDay: false,
    };
    setDays(updatedDays);
  }
  setShowPlanModal(false);
  setSelectedDayIndex(null);
};

const handleToggleRestDay = (index) => {
  const updatedDays = [...days];
  updatedDays[index] = {
    ...updatedDays[index],
    isRestDay: !updatedDays[index].isRestDay,
    planId: updatedDays[index].isRestDay ? updatedDays[index].planId : null,
    planName: updatedDays[index].isRestDay ? updatedDays[index].planName : null,
  };
  setDays(updatedDays);
};

const handleRemovePlan = (index) => {
  const updatedDays = [...days];
  updatedDays[index] = {
    ...updatedDays[index],
    planId: null,
    planName: null,
    isRestDay: false,
  };
  setDays(updatedDays);
};

const renderPlanItem = ({ item }) => (
  <TouchableOpacity
    style={styles.planItem}
    onPress={() => handleSelectPlan(item)}
  >
    <Text style={styles.planItemName}>{item.name}</Text>
    <Ionicons name="chevron-forward" size={20} color={theme.text + '80'} />
  </TouchableOpacity>
);

const renderDayCard = (day, index) => (
  <View key={index} style={styles.dayCard}>
    <View style={styles.dayHeader}>
      <Text style={styles.dayTitle}>Day {day.dayNumber}</Text>
      <View style={styles.dayActions}>
        <TouchableOpacity
          style={styles.restDayButton}
          onPress={() => handleToggleRestDay(index)}
        >
          <Ionicons 
            name={day.isRestDay ? "checkmark-circle" : "ellipse-outline"} 
            size={20} 
            color={day.isRestDay ? theme.primary : theme.text + '80'} 
          />
          <Text style={[styles.restDayText, { 
            color: day.isRestDay ? theme.primary : theme.text + '80' 
          }]}>
            Rest Day
          </Text>
        </TouchableOpacity>
      </View>
    </View>

    {!day.isRestDay && (
      <TouchableOpacity
        style={styles.planButton}
        onPress={() => {
          setSelectedDayIndex(index);
          setShowPlanModal(true);
        }}
      >
        <Text style={styles.planButtonText}>
          {day.planName || 'Select Workout Plan'}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {day.planId && (
            <TouchableOpacity
              style={{ marginRight: 8, padding: 4 }}
              onPress={() => handleRemovePlan(index)}
            >
              <Ionicons name="close-circle" size={20} color="#ff3b30" />
            </TouchableOpacity>
          )}
          <Ionicons name="chevron-forward" size={16} color={theme.primary} />
        </View>
      </TouchableOpacity>
    )}
  </View>
);

return (
    <Animated.View style={[styles.pageWrapper, { opacity: fadeAnim, flex: 1 }]}>
          {/* Save Button */}
      <View style={styles.modalFooter}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            (!programName.trim() || !cycleDays || !totalDays) && styles.saveButtonDisabled
          ]}
          onPress={handleSaveProgram}
          disabled={!programName.trim() || !cycleDays || !totalDays}
        >
          <LinearGradient
            colors={[theme.primary, theme.primary + 'DD']}
            style={styles.saveButtonGradient}
          >
            <View style={styles.saveButtonContent}>
              <Ionicons 
                name={isEditing ? "checkmark" : "add"} 
                size={20} 
                color="#fff" 
                style={styles.saveButtonIcon}
              />
              <Text style={styles.saveButtonText}>
                {isEditing ? 'Update Program' : 'Create Program'}
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      {/* Program Name */}
      <View style={styles.NameContainer}>
          <TextInput
            style={styles.NameInput}
            value={programName}
            onChangeText={setProgramName}
            placeholder="Enter program name"
            placeholderTextColor={theme.text + '60'}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>
    <ScrollView 
      style={{ flex: 1 }}
      contentContainerStyle={{ 
        paddingBottom: 100,
        minHeight: '100%'
      }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      onScrollBeginDrag={() => Keyboard.dismiss()}
    >
        {/* Description */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter program description"
            placeholderTextColor={theme.text + '60'}
            multiline
            maxLength={200}
          />
        </View>

        {/* Duration Inputs */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Program Duration</Text>
          <View style={styles.durationContainer}>
            <View style={styles.durationInputContainer}>
              <Text style={styles.durationLabel}>Cycle Days</Text>
              <TextInput
                style={[styles.input, styles.durationInput]}
                value={cycleDays}
                onChangeText={setCycleDays}
                placeholder="7"
                placeholderTextColor={theme.text + '60'}
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
            <View style={styles.durationInputContainer}>
              <Text style={styles.durationLabel}>Total Days</Text>
              <TextInput
                style={[styles.input, styles.durationInput]}
                value={totalDays}
                onChangeText={setTotalDays}
                placeholder="84"
                placeholderTextColor={theme.text + '60'}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
          </View>
        </View>

        {/* Cycle Days Configuration */}
        {days.length > 0 && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Cycle Configuration</Text>
            {days.map((day, index) => renderDayCard(day, index))}
          </View>
        )}

      {/* Plan Selection Modal */}
      <Modal
        visible={showPlanModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPlanModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => setShowPlanModal(false)}>
            <View style={styles.modalBackdrop} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Workout Plan</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowPlanModal(false)}
              >
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            
            {availablePlans.length > 0 ? (
              <FlatList
                data={availablePlans}
                keyExtractor={item => item.id}
                renderItem={renderPlanItem}
                style={{ maxHeight: 400 }}
              />
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="clipboard-outline" size={48} color={theme.text + '40'} />
                <Text style={styles.emptyText}>
                  No workout plans available.{'\n'}
                  Create some plans first to assign them to your program.
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
      </ScrollView>
    </Animated.View>
);
}

export default ProgramManager;