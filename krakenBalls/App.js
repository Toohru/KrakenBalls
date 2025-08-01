import 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import ExercisesScreen from './screens/exercises';
import PlansScreen from './screens/plans';
import CreatePlanScreen from './screens/createPlan';
import EditPlanScreen from './screens/editPlan';
import ProgressScreen from './screens/progress';
import { Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import exercisesIcon from './assets/exercises-icon.png';
import plansIcon from './assets/plans-icon.png';
import progressIcon from './assets/progress-icon.png';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function PlansStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: '#2C2C2C',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
      <Stack.Screen 
        name="PlansList" 
        component={PlansScreen} 
        options={({ navigation }) => ({
          title: 'Workout Plans',
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => navigation.setParams({ refresh: Date.now() })}
              style={{
                marginRight: 15,
                padding: 8,
              }}
            >
              <Ionicons name="refresh" size={24} color="#4CAF50" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="CreatePlan" 
        component={CreatePlanScreen} 
        options={({ route }) => ({ 
          title: route.params?.planId ? 'Edit Workout Plan' : 'Create Workout Plan' 
        })}
      />
    </Stack.Navigator>
  );
}

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
            screenOptions={({ route } ) => ({
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
            <Tab.Screen name="Exercises" component={ExercisesScreen} />
            <Tab.Screen name="Plans" component={PlansStack} />
            <Tab.Screen name="Progress" component={ProgressScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    );
}