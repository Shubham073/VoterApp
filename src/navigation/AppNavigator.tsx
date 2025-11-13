import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';
import {COLORS} from '../constants/theme';

// Screens
import LandingScreen from '../screens/LandingScreen';
import VoterListScreen from '../screens/VoterListScreen';
import SearchScreen from '../screens/SearchScreen';
import AdvanceSearchScreen from '../screens/AdvanceSearchScreen';
import SurveyScreen from '../screens/SurveyScreen';
import DataScreen from '../screens/DataScreen';
import PublishScreen from '../screens/PublishScreen';
import VoterDetailsScreen from '../screens/VoterDetailsScreen';
import WhatsAppMessageScreen from '../screens/WhatsAppMessageScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  console.log('🧭 AppNavigator initialized');
  
  return (
    <NavigationContainer
      onStateChange={(state) => {
        console.log('🧭 Navigation state changed:', state);
      }}>
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{
          headerShown: false,
          contentStyle: {backgroundColor: COLORS.background},
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="VoterList" component={VoterListScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="AdvanceSearch" component={AdvanceSearchScreen} />
        <Stack.Screen name="Survey" component={SurveyScreen} />
        <Stack.Screen name="Data" component={DataScreen} />
        <Stack.Screen name="Publish" component={PublishScreen} />
        <Stack.Screen name="VoterDetails" component={VoterDetailsScreen} />
        <Stack.Screen name="WhatsAppMessage" component={WhatsAppMessageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
