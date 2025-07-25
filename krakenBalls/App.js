
import { StyleSheet, Text, View } from 'react-native';
import Workout from './components/workouts';

export default function App() {
  return (
    <View style={styles.container}>

      <View style={styles.workoutWrapper}>
        <Text style={styles.sectionTitle}>Kraken Baaaaaalllsssss</Text>

        <View style={styles.items}>
          <Workout />
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1f22',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffff'
  },
  workoutWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20
  }
});
