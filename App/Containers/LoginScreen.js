import React, {useEffect, useState} from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Alert,
  Text,
  Image,
  Dimensions,
} from 'react-native';
import {AsYouType, isValidPhoneNumber} from 'libphonenumber-js';
import auth from '@react-native-firebase/auth';
import Button from '../Components/Button';
import {createNewUser} from '../handlers/user';
import Fonts from '../Theme/Fonts';
import FontSizes from '../Theme/FontSizes';
import Color from '../Theme/Color';
import QueekLogo from '../../assets/Images/QueekLogo.jpeg';
import {getUserByPhone} from '../api/users';
import {setUserDetails} from '../redux/actions/user';
import {userSchema} from '../constants/schema';
import {useDispatch} from 'react-redux';

const nonNumeric = /[^0-9]/gi;
const COUNTRY_CODE = '+91';

const formatPhoneNumber = s =>
  new AsYouType('US').input(s.replace(nonNumeric, ''));

const getRealNumber = s => {
  const asYouType = new AsYouType();
  asYouType.input(s);
  return asYouType.getChars();
};

const LoginScreen = ({navigation}) => {
  const [confirm, setConfirm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  const handleChange = e => {
    setPhone(formatPhoneNumber(e));
  };
  // Phone Authentication process
  const onSubmit = async () => {
    setLoading(true);
    try {
      if (isValidPhoneNumber(phone, 'IN')) {
        const realPhone = getRealNumber(phone);
        const confirmation = await auth().signInWithPhoneNumber(
          `${COUNTRY_CODE}${realPhone}`,
        );
        setConfirm(confirmation);
      } else {
        Alert.alert('Enter a valid phone number.');
      }
    } catch (error) {
      console.log('error', error.message);
      Alert.alert('Something went wrong, try later');
    }
    setLoading(false);
  };

  // Confirm user enter code
  const confirmCode = async () => {
    setLoading(true);
    try {
      await confirm.confirm(code);
    } catch (error) {
      Alert.alert('Invalid code.');
      console.log('Invalid code.');
    }
    setLoading(false);
  };

  // Handle user state changes
  async function onAuthStateChanged(userAuth) {
    if (userAuth && userAuth._user) {
      setUser(userAuth._user);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    if (user) {
      createNewUser(user).then(() => {
        dispatch(setUserDetails(userSchema(user)));
        navigation.replace('BottomTabScreen');
      });
    }
  }, [user]);

  if (!confirm) {
    return (
      <View style={styles.container}>
        <View></View>
        <Image
          source={QueekLogo}
          style={{width: 200, height: 200, borderRadius: 16}}
          resizeMode={'contain'}
        />
        <View style={{alignItems: 'center'}}>
          <Text style={styles.header}>Enter your phone number</Text>
          <TextInput
            onChangeText={handleChange}
            style={styles.phoneNumberInput}
            keyboardType="numeric"
            placeholder="Phone Number"
            defaultValue={phone}
          />
          <Button
            containerStyle={styles.containerStyle}
            text={'Send OTP'}
            onPress={onSubmit}
          />
          {loading && <ActivityIndicator size="large" color={'white'}/>}
          <Text
            style={styles.policy}>{'By continuing, you agree to our Terms of Use and read the Privacy Policy'}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View></View>
      <Image
        source={QueekLogo}
        style={{width: 200, height: 200, borderRadius: 16}}
        resizeMode={'contain'}
      />
      <View style={{alignItems: 'center'}}>
        <Text style={styles.header}>Enter OTP</Text>
        <TextInput
          value={code}
          style={styles.phoneNumberInput}
          onChangeText={setCode}
          keyboardType="numeric"
          placeholder="Enter Code"
        />
        <Button
          containerStyle={styles.containerStyle}
          text="Confirm Code"
          onPress={confirmCode}
        />
        {loading && <ActivityIndicator size="large" color={'white'}/>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.ThemeGreen,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  phoneNumberInput: {
    borderRadius: 8,
    fontSize: 20,
    padding: 12,
    justifyContent: 'center',
    textAlign: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'white',
    width: Dimensions.get('window').width - 32,
    color: 'white',
    fontFamily: Fonts.FontAwesome,
  },
  containerStyle: {
    justifyContent: 'center',
    marginTop: 8,
    width: Dimensions.get('window').width - 32,
  },
  policy: {
    alignSelf: 'baseline',
    fontSize: FontSizes.small,
    color: 'white',
    fontFamily: Fonts.EloquiaDisplayExtraBold,
    marginVertical: 8,
    marginRight: 16,
    lineHeight: 24
  },
  header: {
    fontSize: FontSizes.medium,
    color: 'white',
    fontFamily: Fonts.EloquiaDisplayExtraBold,
    marginBottom: 16,
  },
});

export default LoginScreen;
