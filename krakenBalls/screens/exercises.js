import React, { useState, useEffect, useRef } from 'react';
import { 
    View, 
    Text, 
    Modal, 
    TextInput, 
    Switch, 
    TouchableOpacity,
    FlatList,
    Alert,
    Animated,
    Dimensions,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/styles';

const { width, height } = Dimensions.get('window');
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const STORAGE_KEY = '@krakenballs_exercises';

function ExercisesScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [isHold, setIsHold] = useState(false);
    const [exercises, setExercises] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingExercise, setEditingExercise] = useState(null);

    // Load exercises from AsyncStorage on component mount
    useEffect(() => {
        loadExercises();
    }, []);

    const loadExercises = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
            if (jsonValue !== null) {
                setExercises(JSON.parse(jsonValue));
            }
        } catch (error) {
            console.error('Error loading exercises:', error);
            Alert.alert('Error', 'Failed to load exercises');
        } finally {
            setIsLoading(false);
        }
    };

    const saveExercises = async (exercisesToSave) => {
        try {
            const jsonValue = JSON.stringify(exercisesToSave);
            await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        } catch (error) {
            console.error('Error saving exercises:', error);
            Alert.alert('Error', 'Failed to save exercises');
        }
    };

    const handleAddExercise = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter an exercise name');
            return;
        }

        let updatedExercises;
        
        if (editingExercise) {
            // Update existing exercise
            updatedExercises = exercises.map(ex => 
                ex.id === editingExercise.id 
                    ? {
                        ...ex,
                        name: name.trim(),
                        description: description.trim(),
                        videoUrl: videoUrl.trim(),
                        isHold,
                        updatedAt: new Date().toISOString()
                    }
                    : ex
            );
        } else {
            // Add new exercise
            const newExercise = {
                id: Date.now().toString(),
                name: name.trim(),
                description: description.trim(),
                videoUrl: videoUrl.trim(),
                isHold,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            updatedExercises = [...exercises, newExercise];
        }

        setExercises(updatedExercises);
        await saveExercises(updatedExercises);
        
        // Reset form
        setModalVisible(false);
        setEditingExercise(null);
        setName('');
        setDescription('');
        setVideoUrl('');
        setIsHold(false);
    };

    const handleDeleteExercise = async (id) => {
        const updatedExercises = exercises.filter(ex => ex.id !== id);
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
            })
        ]).start();
    }, []);

    if (isLoading) {
        return (
            <View style={[styles.pageWrapper, { justifyContent: 'center', alignItems: 'center' }]}>
                <View style={styles.loadingContainer}>
                    {[1, 2, 3].map((i) => (
                        <View key={i} style={styles.loadingCard}>
                            <View style={styles.loadingLine} />
                            <View style={[styles.loadingLine, { width: '60%' }]} />
                        </View>
                    ))}
                </View>
            </View>
        );
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <Animated.View 
                style={[
                    styles.pageWrapper,
                    { opacity: fadeAnim }
                ]}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Exercises</Text>
                    <Text style={styles.subtitle}>Manage your exercise library</Text>
                </View>
                
                <AnimatedTouchable
                    style={[
                        styles.addButton,
                        {
                            transform: [
                                {
                                    translateY: slideAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [50, 0]
                                    })
                                }
                            ]
                        }
                    ]}
                    activeOpacity={0.8}
                    onPress={() => {
                        setEditingExercise(null);
                        setModalVisible(true);
                    }}
                >
                    <Ionicons name="add" size={22} color="#fff" />
                    <Text style={styles.addButtonText}>New Exercise</Text>
                </AnimatedTouchable>

            <Animated.View 
                style={[
                    styles.contentContainer,
                    {
                        transform: [
                            {
                                translateY: slideAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [30, 0]
                                })
                            }
                        ]
                    }
                ]}
            >
                <FlatList
                    data={exercises}
                    keyExtractor={item => item.id}
                    style={{ marginTop: 10, width: '100%' }}
                    showsVerticalScrollIndicator={true}
                    contentContainerStyle={{ paddingBottom: 30 }}
                    renderItem={({ item, index }) => (
                        <Animated.View 
                            style={[
                                styles.exerciseCard,
                                {
                                    opacity: fadeAnim,
                                    transform: [
                                        {
                                            translateY: fadeAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [20, 0]
                                            })
                                        }
                                    ]
                                }
                            ]}
                        >
                            <TouchableOpacity 
                                style={styles.exerciseItem}
                                onPress={() => {
                                    setEditingExercise(item);
                                    setName(item.name);
                                    setDescription(item.description || '');
                                    setVideoUrl(item.videoUrl || '');
                                    setIsHold(item.isHold);
                                    setModalVisible(true);
                                }}
                            >
                                <View style={styles.exerciseInfo}>
                                    <View style={{ flex: 1, marginRight: 12 }}>
                                        <Text style={styles.exerciseName} numberOfLines={2}>
                                            {item.name}
                                        </Text>
                                        {item.description ? (
                                            <Text style={styles.exerciseDescription} numberOfLines={1} ellipsizeMode="tail">
                                                {item.description}
                                            </Text>
                                        ) : null}
                                    </View>
                                    <View style={styles.exerciseTypeContainer}>
                                        <Text style={styles.exerciseType}>
                                            <Ionicons 
                                                name={item.isHold ? 'time-outline' : 'repeat-outline'} 
                                                size={16} 
                                                color="#4a90e2" 
                                                style={styles.exerciseTypeIcon}
                                            />
                                            {item.isHold ? 'Hold' : 'Reps'}
                                        </Text>
                                    </View>
                                    <TouchableOpacity 
                                        style={[styles.actionButton, { marginLeft: 12 }]}
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            Alert.alert(
                                                'Delete Exercise',
                                                `Are you sure you want to delete "${item.name}"?`,
                                                [
                                                    { text: 'Cancel', style: 'cancel' },
                                                    { 
                                                        text: 'Delete', 
                                                        style: 'destructive',
                                                        onPress: () => handleDeleteExercise(item.id)
                                                    }
                                                ]
                                            );
                                        }}
                                    >
                                        <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="barbell-outline" size={60} color="#333" />
                            <Text style={styles.emptyStateTitle}>No Exercises Yet</Text>
                            <Text style={styles.emptyStateText}>
                                Get started by adding your first exercise to your library.
                            </Text>
                        </View>
                    }
                />
            </Animated.View>

            {/* Add Exercise Modal */}
            <Modal 
                visible={modalVisible} 
                animationType="fade" 
                transparent={true}
                statusBarTranslucent={true}
                onRequestClose={() => {
                    setModalVisible(false);
                    setName('');
                    setDescription('');
                    setVideoUrl('');
                    setIsHold(false);
                    setEditingExercise(null);
                }}
            >
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback onPress={() => {
                        setModalVisible(false);
                        setName('');
                        setDescription('');
                        setVideoUrl('');
                        setIsHold(false);
                        setEditingExercise(null);
                    }}>
                        <View style={styles.modalBackdrop} />
                    </TouchableWithoutFeedback>
                    
                    <Animated.View 
                        style={[
                            styles.modalContent,
                            {
                                transform: [
                                    {
                                        translateY: slideAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [50, 0]
                                        })
                                    }
                                ]
                            }
                        ]}
                    >
                        <View style={styles.modalHeader}>
                            <View style={styles.modalHeaderContent}>
                                <Text style={styles.modalTitle}>
                                    {editingExercise ? 'Edit Exercise' : 'New Exercise'}
                                </Text>
                                <Text style={styles.modalSubtitle}>
                                    {editingExercise ? 'Update your exercise details' : 'Create a new exercise for your workout'}
                                </Text>
                            </View>
                            <TouchableOpacity 
                                style={styles.closeButton}
                                onPress={() => {
                                    setModalVisible(false);
                                    setName('');
                                    setDescription('');
                                    setVideoUrl('');
                                    setIsHold(false);
                                    setEditingExercise(null);
                                }}
                            >
                                <Ionicons name="close" size={22} color="#888" />
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.modalBody}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Exercise Name</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        placeholder="e.g. Push-ups, Plank, Squats"
                                        placeholderTextColor="#666"
                                        style={styles.input}
                                        value={name}
                                        onChangeText={setName}
                                        autoCapitalize="words"
                                        autoFocus={true}
                                    />
                                </View>
                            </View>
                            
                            <View style={styles.sectionDivider} />
                            
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Description (Optional)</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        placeholder="Brief description of the exercise"
                                        placeholderTextColor="#666"
                                        style={[styles.input, { height: 80, textAlignVertical: 'top', paddingTop: 12 }]}
                                        value={description}
                                        onChangeText={setDescription}
                                        multiline
                                        maxLength={100}
                                    />
                                    <Text style={styles.charCount}>
                                        {description.length}/100
                                    </Text>
                                </View>
                            </View>
                            
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Instruction Video URL (Optional)</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons 
                                        name="link-outline" 
                                        size={18} 
                                        color="#666" 
                                        style={styles.inputIcon} 
                                    />
                                    <TextInput
                                        placeholder="https://youtube.com/..."
                                        placeholderTextColor="#666"
                                        style={[styles.input, { paddingLeft: 36 }]}
                                        value={videoUrl}
                                        onChangeText={setVideoUrl}
                                        keyboardType="url"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                    />
                                </View>
                            </View>
                            
                            <View style={styles.switchContainer}>
                                <View>
                                    <Text style={styles.switchLabel}>Exercise Type</Text>
                                    <Text style={styles.switchSubtitle}>
                                        {isHold ? 'Time based (hold)' : 'Repetition based'}
                                    </Text>
                                </View>
                                <View style={styles.toggleContainer}>
                                    <Text style={styles.toggleLabel}>Reps</Text>
                                    <TouchableOpacity 
                                        style={[
                                            styles.toggleSwitch,
                                            isHold && styles.toggleSwitchActive
                                        ]}
                                        activeOpacity={0.8}
                                        onPress={() => setIsHold(!isHold)}
                                    >
                                        <View style={styles.toggleSwitchTrack}>
                                            <View style={[
                                                styles.toggleSwitchThumb,
                                                isHold && styles.toggleSwitchThumbActive
                                            ]} />
                                        </View>
                                    </TouchableOpacity>
                                    <Text style={styles.toggleLabel}>Time</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={[styles.saveButton, !name.trim() && styles.saveButtonDisabled]}
                                activeOpacity={0.9}
                                onPress={handleAddExercise}
                                disabled={!name.trim()}
                            >
                                {name.trim() ? (
                                    <LinearGradient
                                        colors={['#4a90e2', '#3a7bc8']}
                                        style={styles.saveButtonGradient}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                    >
                                        <View style={styles.saveButtonContent}>
                                            <Ionicons 
                                                name={editingExercise ? 'checkmark' : 'add'} 
                                                size={18} 
                                                color="#fff" 
                                                style={styles.saveButtonIcon} 
                                            />
                                            <Text style={styles.saveButtonText}>
                                                {editingExercise ? 'Save Changes' : 'Add Exercise'}
                                            </Text>
                                        </View>
                                    </LinearGradient>
                                ) : (
                                    <View style={[styles.saveButtonGradient, { backgroundColor: '#3a3a3a' }]}>
                                        <View style={styles.saveButtonContent}>
                                            <Ionicons 
                                                name={editingExercise ? 'checkmark' : 'add'} 
                                                size={18} 
                                                color="#666" 
                                                style={styles.saveButtonIcon} 
                                            />
                                            <Text style={[styles.saveButtonText, { color: '#666' }]}>
                                                {editingExercise ? 'Save Changes' : 'Add Exercise'}
                                            </Text>
                                        </View>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </Modal>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
}

export default ExercisesScreen;