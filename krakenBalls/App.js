import 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

//Exercise Tab
import ExerciseScreen from './screens/ExerciseScreen';
import ExercisesIcon from './assets/exercises-icon.png';

//Plan Tab
import PlanScreen from './screens/PlanScreen';
import PlanManager from './screens/PlanManager';
import PlansIcon from './assets/plans-icon.png';

//Progress Tab
import ProgressScreen from './screens/ProgressScreen';
import ProgressManager from './screens/ProgressManager';
import ProgressIcon from './assets/progress-icon.png';

//Program Tab
import ProgramScreen from './screens/ProgramScreen';
import ProgramManager from './screens/ProgramManager';
import ProgramIcon from './assets/program-icon.png';

//Theme
import { ThemeProvider, useTheme } from './context/ThemeContext.js';

//Settings
import SettingsScreen from './screens/Settings';

/*
import ExercisesScreen from './screens/exercises';
import PlansScreen from './screens/plans';
import CreatePlanScreen from './screens/createPlan';
import EditPlanScreen from './screens/editPlan';
import ProgressScreen from './screens/progress';
*/


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ExercisesStack() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator 
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.card,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: 'bold',
          color: theme.text,
        },
        cardStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Stack.Screen 
        name="ExercisesList" 
        component={ExerciseScreen} 
        options={({ navigation }) => ({
          title: 'Exercises',
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => navigation.setParams({ refresh: Date.now() })}
              style={{
                marginRight: 15,
                padding: 8,
              }}
            >
              <Ionicons name="refresh" size={24} color={theme.primary} />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

function PlansStack() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator 
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.card,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: 'bold',
          color: theme.text,
        },
        cardStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Stack.Screen 
        name="PlansList" 
        component={PlanScreen} 
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
        listeners={({ navigation }) => ({
          focus: () => {
            // When the Plans tab is focused, make sure we're on the main screen
            const state = navigation.getState();
            // Only pop if we're not already on the first screen and there are screens to pop
            if (state.index > 0) {
              navigation.popToTop();
            }
          },
        })}
      />
      <Stack.Screen 
        name="ManagePlan" 
        component={PlanManager} 
        options={({ route }) => ({ 
          title: route.params?.planId ? 'Edit Workout Plan' : 'Create Workout Plan' 
        })}
      />
    </Stack.Navigator>
  );
}

function ProgressStack() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator 
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.card,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: 'bold',
          color: theme.text,
        },
        cardStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Stack.Screen 
        name="ProgressList" 
        component={ProgressScreen} 
        options={({ navigation }) => ({
          title: 'Progress',
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => navigation.setParams({ refresh: Date.now() })}
              style={{
                marginRight: 15,
                padding: 8,
              }}
            >
              <Ionicons name="refresh" size={24} color={theme.primary} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="ProgressManager" 
        component={ProgressManager} 
        options={{
          title: 'Progress Manager',
        }}
      />
    </Stack.Navigator>
  );
}

function ProgramsStack() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator 
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.card,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: 'bold',
          color: theme.text,
        },
        cardStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Stack.Screen 
        name="ProgramList" 
        component={ProgramScreen} 
        options={({ navigation }) => ({
          title: 'Programs',
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => navigation.setParams({ refresh: Date.now() })}
              style={{
                marginRight: 15,
                padding: 8,
              }}
            >
              <Ionicons name="refresh" size={24} color={theme.primary} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="ProgramManager" 
        component={ProgramManager} 
        options={{
          title: 'Program Manager',
        }}
      />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator 
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.card,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: 'bold',
          color: theme.text,
        },
        cardStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{
          title: 'Settings',
        }}
      />
    </Stack.Navigator>
  );
}


const MyTheme = (theme) => ({
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: theme?.primary || '#4CAF50',
    background: theme?.background || '#181818',
    card: theme?.card || '#1a1a1a',
    text: theme?.text || '#ffffff',
    border: theme?.border || '#333333',
    notification: theme?.notification || '#ff3b30',
  },
});

const AppContent = () => {
  const { theme } = useTheme();
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme?.background || '#181818' }}>
      <NavigationContainer theme={MyTheme(theme)}>
        <Tab.Navigator
          screenOptions={({ route }) => {
            let iconName;

            if (route.name === 'Exercises') {
              iconName = 'barbell';
            } else if (route.name === 'Plans') {
              iconName = 'calendar';
            } else if (route.name === 'Programs') {
              iconName = 'list';
            } else if (route.name === 'Progress') {
              iconName = 'stats-chart';
            } else if (route.name === 'Settings') {
              iconName = 'settings';
            }

            return {
              tabBarIcon: ({ color, size }) => (
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name={iconName} size={size} color={color} />
                </View>
              ),
              tabBarActiveTintColor: theme.primary,
              tabBarInactiveTintColor: theme.text + '80',
              tabBarStyle: {
                backgroundColor: theme.card,
                borderTopWidth: 0,
                height: 60,
                paddingBottom: 5,
                paddingTop: 5,
                borderRadius: 15,
                marginBottom: 20,
                marginHorizontal: '2.5%',
              },
              tabBarLabelStyle: {
                fontSize: 12,
                marginBottom: 5,
              },
              headerShown: false,
            };
          }}
        >
          <Tab.Screen 
            name="Exercises" 
            component={ExercisesStack} 
            listeners={({ navigation }) => ({
              tabPress: (e) => {
                // Prevent default action
                e.preventDefault();
                // Reset the Plans stack when switching tabs
                navigation.navigate('Plans', {
                  screen: 'PlansList',
                  params: { refresh: Date.now() }
                });
                // Navigate to Exercises
                navigation.navigate('Exercises');
              },
            })}
          />
          <Tab.Screen 
            name="Plans" 
            component={PlansStack} 
            listeners={({ navigation }) => ({
              tabPress: (e) => {
                // Prevent default action
                e.preventDefault();
                // Reset the Plans stack when switching tabs
                navigation.navigate('Plans', {
                  screen: 'PlansList',
                  params: { refresh: Date.now() }
                });
              },
            })}
          />
          <Tab.Screen 
            name="Programs" 
            component={ProgramsStack}
            listeners={({ navigation }) => ({
              tabPress: (e) => {
                // Prevent default action
                e.preventDefault();
                // Reset the Programs stack when switching tabs
                navigation.navigate('Programs', {
                  screen: 'ProgramsList',
                  params: { refresh: Date.now() }
                });
              },
            })}
          />
          <Tab.Screen 
            name="Progress" 
            component={ProgressStack}
            listeners={({ navigation }) => ({
              tabPress: (e) => {
                // Prevent default action
                e.preventDefault();
                // Reset the Progress stack when switching tabs
                navigation.navigate('Progress', {
                  screen: 'ProgressOverview',
                  params: { refresh: Date.now() }
                });
              },
            })}
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsStack}
            listeners={({ navigation }) => ({
              tabPress: (e) => {
                // Prevent default action
                e.preventDefault();
                // Reset the Settings stack when switching tabs
                navigation.navigate('Settings', {
                  screen: 'Settings',
                  params: { refresh: Date.now() }
                });
              },
            })}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}