import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import ExercisesScreen from './screens/exercises.js';
import PlansScreen from './screens/plans.js';
import ProgressScreen from './screens/progress.js';
import { Image } from 'react-native';
import exercisesIcon from './assets/exercises-icon.png';
import plansIcon from './assets/plans-icon.png';
import progressIcon from './assets/progress-icon.png';
//import styles from './styles/styles.js';

const Tab = createBottomTabNavigator();
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#181818',
  },
};

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#181818' }}>
      <NavigationContainer theme={MyTheme}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {
              backgroundColor: '#2C2C2C',
              borderRadius: 15,
              marginBottom: 20,
              marginHorizontal: '2.5%',
              height: 60,
              paddingTop: 8,
              paddingBottom: 8,
            },
            tabBarIconStyle: {
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            },
            tabBarIcon: ({ focused }) => {
              let icon;
              if (route.name === 'Exercises') icon = exercisesIcon;
              if (route.name === 'Plans') icon = plansIcon;
              if (route.name === 'Progress') icon = progressIcon;
              return (
                <Image
                  source={icon}
                  style={{
                    width: 28,
                    height: 28,
                    tintColor: focused ? '#fff' : '#888',
                    resizeMode: 'contain',
                  }}
                />
              );
            },
          })}
        >
          <Tab.Screen name="Plans" component={PlansScreen} />
          <Tab.Screen name="Progress" component={ProgressScreen} />
          <Tab.Screen name="Exercises" component={ExercisesScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}