import * as React from 'react';
import FontSizes from '../Theme/FontSizes';
import Fonts from '../Theme/Fonts';
import Color from '../Theme/Color';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import OROrdererRequestedToTravellerScreen from './OROrdererRequestedToTravellerScreen';
import ORCreatedOrderScreen from './ORCreatedOrderScreen';
import OROrdererReceivedFromTravellerScreen from './OROrdererReceivedFromTravellerScreen';

const Tab = createMaterialTopTabNavigator();

function ORAllRecentOrderScreen() {
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
      <Tab.Screen name="Created orders" component={ORCreatedOrderScreen} />
      <Tab.Screen
        name="Requested Trips"
        component={OROrdererRequestedToTravellerScreen}
      />
      <Tab.Screen
        name="Received Trips"
        component={OROrdererReceivedFromTravellerScreen}
      />
    </Tab.Navigator>
  );
}

export default ORAllRecentOrderScreen;
