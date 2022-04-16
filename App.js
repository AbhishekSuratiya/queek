import * as React from 'react';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigation from './App/AppNavigation';
import configureAppStore from './App/redux/store';
import firestore from '@react-native-firebase/firestore';
import {SafeAreaView} from 'react-native';
import {UserTypeProvider} from './App/context/userType';
import KycAlertProvider from './App/context/KycAlert';
import {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';

// initialize
export const db = firestore();
const store = configureAppStore();

function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <Provider store={store}>
      <UserTypeProvider>
        <KycAlertProvider>
          <NavigationContainer
            theme={{
              dark: false,
              colors: {
                background: 'white',
                card: 'white',
              },
            }}>
            <SafeAreaView style={{flex: 1}}>
              <AppNavigation />
            </SafeAreaView>
          </NavigationContainer>
        </KycAlertProvider>
      </UserTypeProvider>
    </Provider>
  );
}

export default App;
