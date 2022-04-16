import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {clearUserDetails, setUserDetails} from '../redux/actions/user';
import {useDispatch, useSelector} from 'react-redux';
import {checkAndUpdateKYCStatus} from '../handlers/user';
import {getUserDetails} from '../redux/selectors/user';
import {KYC_STATUS} from '../constants';
import DigioWebview from '../Components/DigioWebview';
import {UserType, UserTypeContext} from '../context/userType';
import FontSizes from '../Theme/FontSizes';
import Fonts from '../Theme/Fonts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Color from '../Theme/Color';

const APPROVED = 'approved';

function MoreScreen({navigation}) {
  const dispatch = useDispatch();
  const storedUser = useSelector(getUserDetails);
  const [isVisibleWV, setIsVisibleWV] = useState(false);

  const signOut = () => {
    auth()
      .signOut()
      .then(() => {
        dispatch(clearUserDetails());
        navigation.replace('LoginScreen');
      });
  };

  const checkKYCStatus = async () => {
    const status = await checkAndUpdateKYCStatus(
      storedUser._id,
      storedUser.kycRequestId,
    );
    if (status) {
      dispatch(
        setUserDetails({
          ...storedUser,
          kycStatus: status,
        }),
      );
    }
  };

  const {kycStatus} = storedUser || {};

  return (
    <>
      {isVisibleWV ? (
        <View style={styles.webviewContainer}>
          <DigioWebview closeWV={() => setIsVisibleWV(false)} />
        </View>
      ) : (
        <>
          <View
            style={{
              flex: 1,
              padding: 16,
              backgroundColor: 'black',
            }}>
            {/*<TouchableOpacity*/}
            {/*  style={styles.itemContainer}*/}
            {/*  onPress={() => navigation.navigate('ReviewScreen')}>*/}
            {/*  <Text style={styles.textStyle}>Submit Review</Text>*/}
            {/*</TouchableOpacity>*/}

            {kycStatus !== APPROVED && (
              <TouchableOpacity
                onPress={checkKYCStatus}
                style={styles.itemContainer}>
                <Text style={styles.textStyle}>Check KYC Status</Text>
              </TouchableOpacity>
            )}

            <View style={styles.itemContainer}>
              <Text style={styles.textStyle}>KYC Status: {kycStatus}</Text>
            </View>

            {kycStatus === KYC_STATUS.PENDING && (
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => setIsVisibleWV(true)}>
                <Text style={styles.textStyle}>Initiate KYC Status</Text>
              </TouchableOpacity>
            )}

            {/*<TouchableOpacity*/}
            {/*  style={[*/}
            {/*    styles.itemContainer,*/}
            {/*    {*/}
            {/*      flexDirection: 'row',*/}
            {/*      alignItems: 'center',*/}
            {/*    },*/}
            {/*  ]}*/}
            {/*  onPress={() =>*/}
            {/*    setUserType(isOrderer ? UserType.travellerer : UserType.orderer)*/}
            {/*  }>*/}
            {/*  <Text style={[styles.textStyle, {marginRight: 8}]}>*/}
            {/*    Switch to {isOrderer ? 'Traveller' : 'Order'}*/}
            {/*  </Text>*/}
            {/*  <MaterialCommunityIcons*/}
            {/*    name={'rotate-3d-variant'}*/}
            {/*    size={30}*/}
            {/*    color={Color.ThemePurple}*/}
            {/*  />*/}
            {/*</TouchableOpacity>*/}
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => navigation.navigate('UserProfileScreen')}>
              <Text style={styles.textStyle}>Edit profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.itemContainer} onPress={signOut}>
              <Text style={[styles.textStyle, {color: Color.RED}]}>
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </>
  );
}

export default MoreScreen;

const styles = StyleSheet.create({
  webviewContainer: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  itemContainer: {
    backgroundColor: '#e5f6fc',
    padding: 14,
    marginBottom: 16,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  textStyle: {
    fontSize: FontSizes.medium - 4,
    color: 'black',
    fontFamily: Fonts.Feather,
    paddingVertical: 2,
  },
});
