import * as React from 'react';
import FontSizes from '../Theme/FontSizes';
import Fonts from '../Theme/Fonts';
import Color from '../Theme/Color';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import TRCreatedTripScreen from './TRCreatedTripScreen';
import TRTravellerReceivedFromOrdererScreen from './TRTravellerReceivedFromOrdererScreen';
import TRTravellerRequestedToOrdererScreen from './TRTravellerRequestedToOrdererScreen';

const Tab = createMaterialTopTabNavigator();

function TRAllRecentTripsScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: FontSizes.small,
          letterSpacing: 0.5,
          fontFamily: Fonts.EloquiaDisplayExtraBold,
          textTransform: 'capitalize',
        },
        tabBarStyle: {backgroundColor: Color.ThemePurple},
        tabBarIndicatorStyle: {height: 2, backgroundColor: 'white'},
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: Color.InActiveTab,
      }}>
      <Tab.Screen name="Created Trips" component={TRCreatedTripScreen} />
      <Tab.Screen
        name="Requested orders"
        component={TRTravellerRequestedToOrdererScreen}
      />
      <Tab.Screen
        name="Received Orders"
        component={TRTravellerReceivedFromOrdererScreen}
      />
    </Tab.Navigator>
  );
}

export default TRAllRecentTripsScreen;
