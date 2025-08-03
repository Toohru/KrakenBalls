import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Modal, 
  Alert,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  width,
  height,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import ExerciseSetEditor from '../components/ExerciseSetEditor';
import { createStyles } from '../styles/styles';
import { useTheme } from '../context/ThemeContext';
import { DeviceEventEmitter } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const PLANS_STORAGE_KEY = '@krakenballs_plans';
const EXERCISES_STORAGE_KEY = '@krakenballs_exercises';

function CreatePlanScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation();
  const route = useRoute();
  
  const [planName, setPlanName] = useState('');
  const [exercises, setExercises] = useState([]);
  const [availableExercises, setAvailableExercises] = useState([]);
  const [isExerciseModalVisible, setIsExerciseModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExercises, setSelectedExercises] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [planId, setPlanId] = useState(null);

  // Load plan data if editing
  useEffect(() => {
      const loadPlanData = async () => {
          try {
              // Check if we're editing an existing plan
              if (route.params?.plan) {
                  const { plan } = route.params;
                  setPlanName(plan.name);
                  setPlanId(plan.id);
                  setExercises(plan.exercises || []);
                  setIsEditing(true);
                  
                  // Mark existing exercises as selected
                  const selected = {};
                  plan.exercises.forEach(ex => {
                      selected[ex.id] = true;
                  });
                  setSelectedExercises(selected);
              } else if (route.params?.planId) {
                  // Load plan by ID
                  const storedPlans = await AsyncStorage.getItem(PLANS_STORAGE_KEY);
                  if (storedPlans) {
                      const plans = JSON.parse(storedPlans);
                      const planToEdit = plans.find(p => p.id === route.params.planId);
                      if (planToEdit) {
                          setPlanName(planToEdit.name);
                          setExercises(planToEdit.exercises || []);
                          setPlanId(planToEdit.id);
                          setIsEditing(true);
                          
                          // Mark existing exercises as selected
                          const selected = {};
                          planToEdit.exercises.forEach(ex => {
                              selected[ex.id] = true;
                          });
                          setSelectedExercises(selected);
                      }
                  }
              }
              
              // Load available exercises
              const storedExercises = await AsyncStorage.getItem(EXERCISES_STORAGE_KEY);
              if (storedExercises) {
                  setAvailableExercises(JSON.parse(storedExercises));
              }
              
          } catch (error) {
              console.error('Error loading plan data:', error);
              Alert.alert('Error', 'Failed to load plan data');
          } finally {
              setIsLoading(false);
          }
      };
      
      loadPlanData();
  }, [route.params]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
        // Check if this is a tab switch (not a back navigation)
        if (e.data.action.type === 'TAB_PRESS' || e.data.action.type === 'NAVIGATE') {
            // Allow the navigation but ensure we go back to the main plan screen
            // when returning to this tab
            setTimeout(() => {
                if (navigation.canGoBack()) {
                    navigation.goBack();
                }
            }, 100);
        }
    });

    return unsubscribe;
}, [navigation]);

  // Load available exercises
  useEffect(() => {
      console.log('useEffect triggered, isExerciseModalVisible:', isExerciseModalVisible);
      
      const loadExercises = async () => {
          console.log('Starting loadExercises...');
          setIsLoading(true);
          
          try {
              // Get exercises from storage
              console.log('1. Getting exercises from storage...');
              const storedExercises = await AsyncStorage.getItem(EXERCISES_STORAGE_KEY);
              console.log('2. Raw exercises data:', storedExercises ? 'Data exists' : 'No data');
              
              if (!storedExercises) {
                  console.log('3. No exercises found in storage');
                  Alert.alert('No Exercises', 'Please add some exercises first in the Exercises tab.');
                  setAvailableExercises([]);
                  return;
              }
              
              console.log('4. Parsing exercises...');
              const parsedExercises = JSON.parse(storedExercises);
              console.log('5. Parsed exercises type:', Array.isArray(parsedExercises) ? 'Array' : typeof parsedExercises);
              
              if (!Array.isArray(parsedExercises)) {
                  console.error('6. Exercises data is not an array:', parsedExercises);
                  setAvailableExercises([]);
                  return;
              }
              
              console.log(`7. Found ${parsedExercises.length} exercises`);
              
              // Filter out exercises already in the plan and ensure they have required properties
              const exerciseIdsInPlan = new Set(exercises.map(ex => ex.exerciseId || ex.id));
              const filteredExercises = parsedExercises
                  .filter(ex => ex && ex.id && !exerciseIdsInPlan.has(ex.id))
                  .map(ex => ({
                      ...ex,
                      isHold: ex.isHold || false, // Ensure isHold is always defined
                      // Ensure sets array exists and has at least one set
                      sets: ex.sets?.length ? ex.sets : [{
                          id: Date.now().toString(),
                          reps: ex.isHold ? 30 : 10,
                          weight: 0,
                          timeInterval: ex.isHold ? 30 : undefined
                      }]
                  }));
              
              console.log(`8. Filtered to ${filteredExercises.length} available exercises`);
              setAvailableExercises(filteredExercises);
              
          } catch (error) {
              console.error('9. Error in loadExercises:', error);
              setAvailableExercises([]);
              Alert.alert('Error', 'Failed to load exercises: ' + error.message);
          } finally {
              console.log('10. Finished loading exercises');
              setIsLoading(false);
          }
      };

      if (isExerciseModalVisible) {
          console.log('Modal is visible, loading exercises...');
          loadExercises();
      } else {
          console.log('Modal is not visible, skipping exercise load');
          setAvailableExercises([]);
          setIsLoading(false); // Make sure to reset loading state
      }
      
      // Cleanup function
      return () => {
          console.log('Cleaning up exercise loading');
          setAvailableExercises([]);
          // Don't set isLoading here as it can cause race conditions
      };
  }, [isExerciseModalVisible]);

  const handleExerciseSelect = (exercise) => {
      setSelectedExercises(prev => ({
          ...prev,
          [exercise.id]: !prev[exercise.id]
      }));
  };
  
  const removeExercise = (exerciseId) => {
      setExercises(prev => prev.filter(ex => ex.id !== exerciseId));
      setSelectedExercises(prev => ({
          ...prev,
          [exerciseId]: false
      }));
  };

  const addSelectedExercises = () => {
      const selectedIds = Object.keys(selectedExercises).filter(id => selectedExercises[id]);
      if (selectedIds.length === 0) return;

      const exercisesToAdd = availableExercises
          .filter(ex => selectedIds.includes(ex.id))
          .map(exercise => ({
              id: Date.now().toString() + exercise.id,
              exerciseId: exercise.id,
              name: exercise.name,
              isHold: exercise.isHold,
              sets: [{
                  id: Date.now().toString(),
                  reps: exercise.isHold ? 30 : 10, // Default values
                  weight: 0,
                  timeInterval: exercise.isHold ? 30 : undefined
              }]
          }));

      setExercises([...exercises, ...exercisesToAdd]);
      setSelectedExercises({});
      setSearchQuery('');
      setIsExerciseModalVisible(false);
  };

  const filteredExercises = availableExercises.filter(exercise => 
      exercise.name && exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter(Boolean);


  const savePlan = async () => {
      if (!planName.trim()) {
          Alert.alert('Error', 'Please enter a plan name');
          return;
      }

      if (exercises.length === 0) {
          Alert.alert('Error', 'Please add at least one exercise to the plan');
          return;
      }

      try {
          setIsLoading(true);
          const storedPlans = await AsyncStorage.getItem(PLANS_STORAGE_KEY);
          const plans = storedPlans ? JSON.parse(storedPlans) : [];
          
          const planData = {
              id: planId || Date.now().toString(),
              name: planName.trim(),
              exercises: exercises,
              updatedAt: new Date().toISOString(),
              createdAt: planId ? 
                  (plans.find(p => p.id === planId)?.createdAt || new Date().toISOString()) : 
                  new Date().toISOString()
          };

          let updatedPlans;
          if (planId) {
              // Update existing plan
              updatedPlans = plans.map(plan => 
                  plan.id === planId ? planData : plan
              );
          } else {
              // Add new plan
              updatedPlans = [...plans, planData];
          }

          await AsyncStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(updatedPlans));
          
          // Emit event to notify PlanScreen to refresh
          DeviceEventEmitter.emit('plansUpdated');
          
          // Simply go back to the previous screen instead of navigating to a new one
          navigation.goBack();
          
      } catch (error) {
          console.error('Error saving plan:', error);
          Alert.alert('Error', 'Failed to save workout plan');
      } finally {
          setIsLoading(false);
      }
  };

  // Only show loading when modal is visible and loading
  if (isLoading && isExerciseModalVisible) {
      return (
          <View style={[styles.loadingContainer, { backgroundColor: '#1e1e1e' }]}>
              <ActivityIndicator size="large" color="#4a90e2" />
              <Text style={styles.loadingText}>Loading exercises...</Text>
          </View>
      );
  }

  return (
      <View style={styles.pageWrapper}>
          {/* Save Button Bar at the top */}
          <View style={styles.saveButtonContainer}>
              <TouchableOpacity
                  style={styles.saveButtonBar}
                  onPress={savePlan}
                  activeOpacity={0.9}
              >
                  <Ionicons name="checkmark-circle" size={22} color="#fff" />
                  <Text style={styles.saveButtonBarText}>Save Workout Plan</Text>
              </TouchableOpacity>
          </View>

          {/* Plan name input */}
          <View style={styles.NameContainer}>
              <TextInput
                  placeholder="Enter plan name"
                  placeholderTextColor="#888"
                  style={styles.NameInput}
                  value={planName}
                  onChangeText={setPlanName}
                  selectionColor="#4a90e2"
                  autoCapitalize="words"
                  autoCorrect={false}
              />
          </View>

          <ScrollView 
              style={styles.contentContainer}
              contentContainerStyle={styles.exerciseList}
          >
              {exercises.map((exercise, exerciseIndex) => (
                  <View key={`exercise-${exercise.id}-${exerciseIndex}`} style={styles.exerciseItem}>
                      <View style={styles.exerciseHeader}>
                          <Text style={styles.exerciseName}>{exercise.name}</Text>
                          <TouchableOpacity 
                              onPress={() => removeExercise(exercise.id)}
                              style={styles.deleteButton}
                          >
                              <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
                          </TouchableOpacity>
                      </View>
                      
                      <ExerciseSetEditor
                          sets={exercise.sets}
                          onUpdateSets={(updatedSets) => {
                              const updatedExercises = [...exercises];
                              updatedExercises[exerciseIndex] = {
                                  ...exercise,
                                  sets: updatedSets
                              };
                              setExercises(updatedExercises);
                          }}
                          isHold={exercise.isHold}
                          minSets={1}
                          maxSets={10}
                      />
                  </View>
              ))}
          </ScrollView>

          {/* Empty state message */}
          {exercises.length === 0 && (
              <View style={styles.emptyStateContainer}>
                  <View style={styles.emptyCircle}>
                      <Ionicons name="fitness" size={32} color={theme.primary} />
                  </View>
                  <Text style={styles.emptyStateText}>
                      No exercises yet.{'\n'}
                      <Text style={styles.emptyStateHighlight}>Tap the + button</Text> to create your first exercise!
                  </Text>
              </View>
          )}
          
          {/* FAB for adding exercises */}
          <TouchableOpacity 
              style={styles.fab}
              onPress={() => setIsExerciseModalVisible(true)}
              activeOpacity={0.9}
          >
              <Ionicons name="add" size={28} color="#fff" />
          </TouchableOpacity>

          {/* Exercise Selection Modal */}
          <Modal
              visible={isExerciseModalVisible}
              animationType="slide"
              transparent={true}
              onRequestClose={() => setIsExerciseModalVisible(false)}
          >
              <View style={styles.modalOverlay}>

                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)'
                      }}>
                        <View style={{
                            backgroundColor: theme.card,
                            borderRadius: 20,
                            padding: 20,
                            width: width * 0.9,
                            maxHeight: height * 0.8,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                        }}>
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
                                    textAlignVertical: 'top'
                                }}
                                placeholder="Search exercises..."
                                placeholderTextColor={theme.text + '80'}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                selectionColor="#4a90e2"
                                />
                            {isLoading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color={theme.primary} />
                                    <Text style={styles.loadingText}>Loading exercises...</Text>
                                </View>
                            ) : (
                                <FlatList
                                    data={filteredExercises}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
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
                                            onPress={() => handleExerciseSelect(item)}
                                        >
                                            <View style={styles.exerciseInfo}>
                                                <Text style={styles.exerciseName}>{item.name}</Text>
                                                {item.description && (
                                                    <Text style={styles.exerciseDescription}>{item.description}</Text>
                                                )}
                                            </View>
                                            <View style={theme.background}>
                                                <Ionicons 
                                                    name={selectedExercises[item.id] ? "checkbox" : "square-outline"} 
                                                    size={24} 
                                                    color={selectedExercises[item.id] ? theme.primary : theme.text} 
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                    ListEmptyComponent={() => (
                                        <View style={styles.emptyContainer}>
                                            <Text style={styles.emptyText}>
                                                {searchQuery ? 'No exercises found matching your search.' : 'No exercises available. Add some exercises first!'}
                                            </Text>
                                        </View>
                                    )}
                                />
                            )}

                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: theme.border,
                                        borderRadius: 10,
                                        padding: 15,
                                        flex: 1,
                                        marginRight: 10,
                                        alignItems: 'center'
                                    }}
                                    onPress={() => {
                                        setIsExerciseModalVisible(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.text,
                                        {
                                            color: theme.text,
                                            fontWeight: '600'
                                        }
                                    ]}>
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
                                        alignItems: 'center'
                                    }}
                                    onPress={addSelectedExercises}
                                >
                                    <Text style={[
                                        styles.text,
                                        {
                                            color: theme.card,
                                            fontWeight: '600'
                                        }
                                    ]}>
                                        Add Selected
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                      </View>
                </TouchableWithoutFeedback>
              </View>
          </Modal>
      </View>
  );
}

export default CreatePlanScreen;