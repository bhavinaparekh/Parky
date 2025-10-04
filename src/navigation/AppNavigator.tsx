import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../types';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import SpaceDetailsScreen from '../screens/space/SpaceDetailsScreen';
import BookingConfirmationScreen from '../screens/booking/BookingConfirmationScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import MySpacesScreen from '../screens/space/MySpacesScreen';
import AddSpaceScreen from '../screens/space/AddSpaceScreen';
import EditSpaceScreen from '../screens/space/EditSpaceScreen';
import MyBookingsScreen from '../screens/booking/MyBookingsScreen';
import BookingDetailsScreen from '../screens/booking/BookingDetailsScreen';
import ReviewsScreen from '../screens/profile/ReviewsScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import HelpScreen from '../screens/profile/HelpScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    }
  };

  if (isAuthenticated === null) {
    // Loading state - you can add a loading screen here
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#fff' },
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen 
              name="SpaceDetails" 
              component={SpaceDetailsScreen}
              options={{ headerShown: true, title: 'Space Details' }}
            />
            <Stack.Screen 
              name="BookingConfirmation" 
              component={BookingConfirmationScreen}
              options={{ headerShown: true, title: 'Booking Confirmation' }}
            />
            <Stack.Screen 
              name="EditProfile" 
              component={EditProfileScreen}
              options={{ headerShown: true, title: 'Edit Profile' }}
            />
            <Stack.Screen 
              name="MySpaces" 
              component={MySpacesScreen}
              options={{ headerShown: true, title: 'My Spaces' }}
            />
            <Stack.Screen 
              name="AddSpace" 
              component={AddSpaceScreen}
              options={{ headerShown: true, title: 'Add Space' }}
            />
            <Stack.Screen 
              name="EditSpace" 
              component={EditSpaceScreen}
              options={{ headerShown: true, title: 'Edit Space' }}
            />
            <Stack.Screen 
              name="MyBookings" 
              component={MyBookingsScreen}
              options={{ headerShown: true, title: 'My Bookings' }}
            />
            <Stack.Screen 
              name="BookingDetails" 
              component={BookingDetailsScreen}
              options={{ headerShown: true, title: 'Booking Details' }}
            />
            <Stack.Screen 
              name="Reviews" 
              component={ReviewsScreen}
              options={{ headerShown: true, title: 'Reviews' }}
            />
            <Stack.Screen 
              name="Settings" 
              component={SettingsScreen}
              options={{ headerShown: true, title: 'Settings' }}
            />
            <Stack.Screen 
              name="Help" 
              component={HelpScreen}
              options={{ headerShown: true, title: 'Help' }}
            />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
