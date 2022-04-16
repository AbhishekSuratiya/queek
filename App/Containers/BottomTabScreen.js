import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import * as React from 'react';
import ORAllRecentOrderScreen from './ORAllRecentOrderScreen';
import TRAllRecentTripsScreen from './TRAllRecentTripsScreen';
import MoreScreen from './MoreScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../Theme/Color';
import ORCreateOrderScreen from './ORCreateOrderScreen';
import TRCreateTripScreen from './TRCreateTripScreen';
import {useContext} from 'react';
import {UserTypeContext} from '../context/userType';
import {useSelector} from "react-redux";
import {getUserDetails} from "../redux/selectors/user";

const Tab = createBottomTabNavigator();

function BottomTabScreen() {
  const {isOrderer} = useContext(UserTypeContext);
  const bottomTabIconSize = 30;
  const bottomTabFontSize = 14;
  const bottomTabActiveColor = Color.ThemePurple;
  const bottomTabInActiveColor = Color.LightGrey1;
  const storedUser = useSelector(getUserDetails);

  const {kycStatus} = storedUser || {};

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {height: 66, paddingBottom: 10, backgroundColor: 'black'},
      }}>
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: e => {
            return (
              <MaterialCommunityIcons
                name={'home'}
                size={bottomTabIconSize}
                color={
                  e.focused ? bottomTabActiveColor : bottomTabInActiveColor
                }
              />
            );
          },
          tabBarLabelStyle: {fontSize: bottomTabFontSize},
          tabBarActiveTintColor: Color.ThemePurple,
        }}
        name="Home"
        component={isOrderer ? ORCreateOrderScreen : TRCreateTripScreen}
      />
      {isOrderer ? (
        <Tab.Screen
          name="Orders"
          component={ORAllRecentOrderScreen}
          options={{
            headerShown: false,
            tabBarIcon: e => {
              return (
                <MaterialCommunityIcons
                  name={'bag-checked'}
                  size={bottomTabIconSize}
                  color={
                    e.focused ? bottomTabActiveColor : bottomTabInActiveColor
                  }
                />
              );
            },
            tabBarLabelStyle: {fontSize: bottomTabFontSize},
            tabBarActiveTintColor: Color.ThemePurple,
          }}
        />
      ) : (
        <Tab.Screen
          name="Trips"
          component={TRAllRecentTripsScreen}
          options={{
            headerShown: false,
            tabBarIcon: e => {
              return (
                <MaterialCommunityIcons
                  name={'airplane'}
                  size={bottomTabIconSize}
                  color={
                    e.focused ? bottomTabActiveColor : bottomTabInActiveColor
                  }
                />
              );
            },
            tabBarLabelStyle: {fontSize: bottomTabFontSize},
            tabBarActiveTintColor: Color.ThemePurple,
          }}
        />
      )}
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{
          title: 'More',
          headerStyle: {
            backgroundColor: Color.ThemePurple,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            textAlign: 'center'
          },
          tabBarIcon: e => {
            return (
              <MaterialCommunityIcons
                name={kycStatus !== 'approved' ? 'account-alert' : 'account'}
                size={bottomTabIconSize}
                color={
                  e.focused ? bottomTabActiveColor : bottomTabInActiveColor
                }
              />
            );
          },
          tabBarLabelStyle: {fontSize: bottomTabFontSize},
          tabBarActiveTintColor: Color.ThemePurple,
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabScreen;
