import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabScreen from './Containers/BottomTabScreen';
import LoginScreen from './Containers/LoginScreen';
import MoreScreen from './Containers/MoreScreen';
import ReviewScreen from './Containers/ReviewScreen';
import Color from './Theme/Color';
import ORCreateOrderFormScreen from './Containers/ORCreateOrderFormScreen';
import TRAddTravelDetailsFormScreen from './Containers/TRAddTravelDetailsFormScreen';
import UserProfileScreen from './Containers/UserProfileScreen';
import {useSelector} from 'react-redux';
import {getUserDetails} from './redux/selectors/user';

// Initialize
const Stack = createNativeStackNavigator();

function AppNavigation() {
  const user = useSelector(getUserDetails);

  return (
    <Stack.Navigator
      initialRouteName={`${user ? 'BottomTabScreen' : 'LoginScreen'}`}>
      <Stack.Screen
        name="BottomTabScreen"
        options={{headerShown: false}}
        component={BottomTabScreen}
      />
      <Stack.Screen
        options={{
          title: 'Login',
          headerStyle: {
            backgroundColor: Color.ThemePurple,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            textAlign: 'center',
          },
        }}
        name="LoginScreen"
        component={LoginScreen}
      />
      <Stack.Screen
        options={{
          title: 'More',
          headerStyle: {
            backgroundColor: Color.ThemePurple,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            textAlign: 'center',
          },
        }}
        name="MoreScreen"
        component={MoreScreen}
      />
      <Stack.Screen name="ReviewScreen" component={ReviewScreen} />
      <Stack.Screen
        options={{
          title: 'Create order form',
          headerStyle: {
            backgroundColor: Color.ThemePurple,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            textAlign: 'center',
          },
        }}
        name="ORCreateOrderFormScreen"
        component={ORCreateOrderFormScreen}
      />
      <Stack.Screen
        options={{
          title: 'Add trip details',
          headerStyle: {
            backgroundColor: Color.ThemePurple,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            textAlign: 'center',
          },
        }}
        name="TRAddTravelDetailsFormScreen"
        component={TRAddTravelDetailsFormScreen}
      />
      <Stack.Screen
        options={{
          title: 'Edit your details',
          headerStyle: {
            backgroundColor: Color.ThemePurple,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            textAlign: 'center',
          },
        }}
        name="UserProfileScreen"
        component={UserProfileScreen}
      />
    </Stack.Navigator>
  );
}

export default AppNavigation;
