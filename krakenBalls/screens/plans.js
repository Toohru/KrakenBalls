import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/styles';

const PLANS_STORAGE_KEY = '@krakenballs_plans';

export default function PlansScreen() {
    const navigation = useNavigation();
    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load plans when screen comes into focus
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', loadPlans);
        return unsubscribe;
    }, [navigation]);
    
    // Handle refresh from header button
    useEffect(() => {
        const refreshParam = navigation.getState()?.routes?.[0]?.params?.refresh;
        if (refreshParam) {
            loadPlans();
            // Reset the refresh param to allow future refreshes
            navigation.setParams({ refresh: undefined });
        }
    }, [navigation.getState()?.routes?.[0]?.params?.refresh]);

    const loadPlans = async () => {
        console.log('Loading plans...');
        setIsLoading(true);
        try {
            const jsonValue = await AsyncStorage.getItem(PLANS_STORAGE_KEY);
            console.log('Raw plans data:', jsonValue ? 'Data exists' : 'No data');
            
            if (jsonValue) {
                const parsedPlans = JSON.parse(jsonValue);
                console.log(`Found ${parsedPlans.length} plans`);
                setPlans(Array.isArray(parsedPlans) ? parsedPlans : []);
            } else {
                console.log('No plans found in storage');
                setPlans([]);
            }
        } catch (error) {
            console.error('Error loading plans:', error);
            Alert.alert('Error', 'Failed to load workout plans: ' + error.message);
            setPlans([]);
        } finally {
            console.log('Finished loading plans');
            setIsLoading(false);
        }
    };

    const navigateToCreatePlan = () => {
        navigation.navigate('CreatePlan');
    };

    const navigateToPlan = (plan) => {
        if (plan && plan.id) {
            navigation.navigate('CreatePlan', { 
                planId: plan.id,
                plan: plan
            });
        }
    };

    const deletePlan = async (planId, planName) => {
        Alert.alert(
            'Delete Plan',
            `Are you sure you want to delete "${planName}"?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const updatedPlans = plans.filter(plan => plan.id !== planId);
                            const jsonValue = JSON.stringify(updatedPlans);
                            await AsyncStorage.setItem(PLANS_STORAGE_KEY, jsonValue);
                            setPlans(updatedPlans);
                        } catch (error) {
                            console.error('Error deleting plan:', error);
                            Alert.alert('Error', 'Failed to delete plan');
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

        const renderPlanItem = ({ item }) => {
        // Calculate total sets and exercises
        const totalExercises = item.exercises.length;
        const totalSets = item.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0);
        
        // Format date
        const formatDate = (dateString) => {
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        };

        return (
            <View style={styles.planCard}>
                <TouchableOpacity 
                    style={styles.planContent}
                    onPress={() => navigateToPlan(item)}
                    activeOpacity={0.8}
                >
                    <View style={styles.planInfo}>
                        <Text style={styles.planName}>{item.name}</Text>
                        <View style={styles.planMeta}>
                            <View style={styles.planDetails}>
                                <View style={styles.planDetailItem}>
                                    <Ionicons name="barbell-outline" size={16} color="#4CAF50" />
                                    <Text style={styles.planDetailText}>{totalExercises} {totalExercises === 1 ? 'exercise' : 'exercises'}</Text>
                                </View>
                                <View style={styles.planDetailItem}>
                                    <Ionicons name="repeat-outline" size={16} color="#4CAF50" />
                                    <Text style={styles.planDetailText}>{totalSets} {totalSets === 1 ? 'set' : 'sets'}</Text>
                                </View>
                            </View>
                            <Text style={styles.planDate}>
                                {formatDate(item.updatedAt || item.createdAt)}
                            </Text>

                            <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => deletePlan(item.id, item.name)}
                    activeOpacity={0.7}
                >
                    <Ionicons name="trash-outline" size={20} color="#ff4444" />
                </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Ionicons name="barbell-outline" size={64} color="#333" />
            <Text style={styles.emptyStateText}>
                You don't have any workout plans yet.
            </Text>
            <TouchableOpacity
                style={styles.primaryButton}
                onPress={navigateToCreatePlan}
            >
                <Text style={styles.buttonText}>Create Your First Plan</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.pageWrapper}>
            
            {plans.length > 0 && (
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={navigateToCreatePlan}
                >
                    <Text style={styles.buttonText}>+ New Workout Plan</Text>
                </TouchableOpacity>
            )}

            {plans.length > 0 ? (
                <FlatList
                    data={plans}
                    renderItem={renderPlanItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                renderEmptyState()
            )}
        </View>
    );
}