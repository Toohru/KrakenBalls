
import { View, Text, StyleSheet } from 'react-native';

import styles from '../styles/styles';


export default function PlansScreen({ navigation }) {
    return (
        <View style={styles.pageWrapper}>
            <Text style={styles.title}>Kraken Balls Workout Plan</Text>
            <Text style={styles.text}>This is the main page</Text>
        </View>
    );
}