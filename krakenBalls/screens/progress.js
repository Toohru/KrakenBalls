
import { View, Text, StyleSheet } from 'react-native';

import styles from '../styles/styles';


export default function ProgressScreen({ navigation }) {
    return (
        <View style={styles.pageWrapper}>
            <Text style={styles.title}>Progress</Text>
            <Text style={styles.text}>Track your Progress Here</Text>
        </View>
    );
}
