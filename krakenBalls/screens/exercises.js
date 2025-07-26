import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Modal, TextInput, Switch, TouchableOpacity } from 'react-native';
import styles from '../styles/styles';
import database from '../database/exerciseDatabase.js';

export default function ExercisesScreen({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [isHold, setIsHold] = useState(false);
    const [repsOrSeconds, setRepsOrSeconds] = useState('');
    const [sets, setSets] = useState('');

    const handleAddExercise = () => {
        // Save the exercise (add your logic here)
        setModalVisible(false);
        setName('');
        setIsHold(false);
        setRepsOrSeconds('');
        setSets('');
    };

    return (
        <View style={styles.pageWrapper}>
            <Text style={styles.title}>Exercises</Text>
            <Text style={styles.text}>Here you can find various exercises to help you train effectively.</Text>
            <TouchableOpacity
                style={{ marginTop: 20, backgroundColor: '#444', padding: 10, borderRadius: 8 }}
                onPress={() => setModalVisible(true)}
            >
                <Text style={{ color: '#fff', textAlign: 'center' }}>Add Exercise</Text>
            </TouchableOpacity>
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)'
                }}>
                    <View style={{
                        backgroundColor: '#222',
                        padding: 20,
                        borderRadius: 10,
                        width: '80%'
                    }}>
                        <Text style={{ color: '#fff', fontSize: 18, marginBottom: 10 }}>Add New Exercise</Text>
                        <TextInput
                            placeholder="Exercise Name"
                            placeholderTextColor="#888"
                            style={{ color: '#fff', borderBottomWidth: 1, borderColor: '#555', marginBottom: 15 }}
                            value={name}
                            onChangeText={setName}
                        />
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                            <Text style={{ color: '#fff', marginRight: 10 }}>Hold?</Text>
                            <Switch value={isHold} onValueChange={setIsHold} />
                        </View>
                        <TextInput
                            placeholder={isHold ? "Seconds" : "Reps"}
                            placeholderTextColor="#888"
                            keyboardType="numeric"
                            style={{ color: '#fff', borderBottomWidth: 1, borderColor: '#555', marginBottom: 15 }}
                            value={repsOrSeconds}
                            onChangeText={setRepsOrSeconds}
                        />
                        <TextInput
                            placeholder="Sets"
                            placeholderTextColor="#888"
                            keyboardType="numeric"
                            style={{ color: '#fff', borderBottomWidth: 1, borderColor: '#555', marginBottom: 15 }}
                            value={sets}
                            onChangeText={setSets}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Button title="Cancel" color="#888" onPress={() => setModalVisible(false)} />
                            <Button title="Add" color="#4CAF50" onPress={handleAddExercise} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}