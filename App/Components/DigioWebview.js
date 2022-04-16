import React, {useEffect, useState} from 'react';
import {WebView} from 'react-native-webview';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {DIGIO_CONSTANTS, KYC_STATUS} from '../constants';
import {encodeBASE64, fetchDigioBaseUrl} from '../utils';
import {getUserDetails} from '../redux/selectors/user';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {updateUserApi} from '../api/users';
import {setUserDetails} from '../redux/actions/user';
import {parse} from 'search-params';

export default function DigioWebview({closeWV}) {
  const dispatch = useDispatch();
  const storedUser = useSelector(getUserDetails);
  const [KYCResponse, setKYCResponse] = useState(null);

  const checkAndRequestForPermission = async () => {
    try {
      const result = await check(PERMISSIONS.ANDROID.CAMERA);
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          break;
        case RESULTS.DENIED:
          console.log(
            'The permission has not been requested / is denied but requestable',
          );
          await request(PERMISSIONS.IOS.CAMERA).then(result => {
            console.log('result', result);
          });
          break;
        case RESULTS.LIMITED:
          console.log('The permission is limited: some actions are possible');
          break;
        case RESULTS.GRANTED:
          console.log('The permission is granted');
          break;
        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          break;
      }
    } catch (error) {
      console.log('ERROR', error);
    }
  };

  useEffect(() => {
    const {CLIENT_ID: clientId, CLIENT_SECRET: clientSecret} =
      DIGIO_CONSTANTS[process.env.NODE_ENV];
    const instance = axios.create({
      baseURL: fetchDigioBaseUrl,
      headers: {
        'Content-type': 'application/json',
        Authorization: `Basic ${encodeBASE64(`${clientId}:${clientSecret}`)}`,
      },
    });
    (async () => {
      try {
        // await checkAndRequestForPermission();
        const {data} = await instance.post(`request/with_template`, {
          customer_identifier: storedUser.phoneNumber,
          template_name: 'AADHAAR TEST', //name of workflow set on dashboard
          notify_customer: false,
          generate_access_token: true, //pass to remove email/mobile auth step
        });
        await setKYCResponse(data);
      } catch (err) {
        Alert.alert('Something went wrong, Please try later');
        console.log('error', err.message);
        closeWV();
      }
    })();
  }, []);

  const onNavigationChanged = async ev => {
    const message = parse(ev?.url);
    if (message?.exitMessage === 'KYC Process Completed.') {
      const {_id} = storedUser;
      await updateUserApi(_id, {
        kycRequestId: id,
        kycStatus: KYC_STATUS.PROGRESS,
      });
      dispatch(
        setUserDetails({
          ...storedUser,
          kycRequestId: id,
          kycStatus: KYC_STATUS.PROGRESS,
        }),
      );
      closeWV();
    }
  };

  if (!KYCResponse) return <ActivityIndicator color="blue" />;

  const {reference_id, customer_identifier, id} = KYCResponse;

  const source = `${
    DIGIO_CONSTANTS[process.env.NODE_ENV].WEBVIEW_URL
  }/#/gateway/login/${id}/${reference_id}/${customer_identifier}`;

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={closeWV} style={styles.cross}>
          <Icon name={'cross'} size={30} color="black" />
        </TouchableOpacity>
      </View>
      <WebView
        containerStyle={styles.webviewContainer}
        onNavigationStateChange={onNavigationChanged}
        originWhitelist={['https://*']}
        startInLoadingState={true}
        source={{uri: source}}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: '100%',
    zIndex: 9,
    top: 10,
    left: 0,
    paddingRight: 20,
  },
  webviewContainer: {
    backgroundColor: 'white',
  },
});

// digioSession.startSession("KID2202251228566578PSXRO4ZMSTWY6", "9205707912","GWT2202251228566848BUAGIJU9DIQPG",this);// this refers //DigioKycResponseListener
