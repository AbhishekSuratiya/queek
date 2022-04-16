import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import FontSizes from '../Theme/FontSizes';
import Fonts from '../Theme/Fonts';
import TRAddTravelDetailsForm from '../Components/TRAddTravelDetailsForm';
import QueekModal from '../modal/QueekModal';
import Color from '../Theme/Color';
import {getOrders} from '../handlers/order';
import {getTravellers} from '../handlers/travel';
import ORMakeOfferCard from '../Components/ORMakeOfferCard';
import {useSelector} from 'react-redux';
import {getUserDetails} from '../redux/selectors/user';
import {updateOrderApi} from '../api/order';
import {UserType, UserTypeContext} from '../context/userType';
import {useKycAlertContext} from '../context/KycAlert';
import Button from '../Components/Button';

function TRCreateTripScreen({navigation}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [switching, setSwitching] = useState(false);

  const user = useSelector(getUserDetails);
  const toggleSwitch = () => {
    setSwitching(true);
    const timeOutId = setTimeout(() => {
      setUserType(isOrderer ? UserType.travellerer : UserType.orderer);
      setSwitching(false);
      clearTimeout(timeOutId);
    }, 500);
  };
  const {isOrderer, setUserType} = useContext(UserTypeContext);
  const alertKyc = useKycAlertContext();

  const fetchOrders = () => {
    getOrders().then(data => {
      setOrders(data);
    });
  };

  const orderMakeOfferHandler = async order => {
    if (!alertKyc.isKycDone) {
      return alertKyc.openAlert();
    }

    try {
      setLoading(true);
      const newRequestedTravellersId = [
        ...(order.requestedTravellersId ?? []),
        user?._id,
      ];
      await updateOrderApi(order.id, {
        requestedTravellersId: newRequestedTravellersId,
      });
      fetchOrders();
      setLoading(false);
      Alert.alert('Offer sent!');
    } catch (error) {
      setLoading(false);
      Alert.alert(error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const isOfferSent = order => {
    const {requestedTravellersId} = order;
    if (requestedTravellersId && user) {
      return requestedTravellersId.includes(user._id);
    }
    return false;
  };

  const getUserName = () => {
    if (user?.name) {
      return `Hi ${user?.name?.split(' ')?.[0]},`;
    }
    return '';
  };

  return (
    <ScrollView style={styles.container}>
      <View
        style={{flexDirection: 'row', alignSelf: 'flex-end', marginBottom: 4}}>
        <Button
          containerStyle={{width: 200, paddingHorizontal: 16}}
          textStyle={{fontSize: 16}}
          text={'Switch to orderer'}
          onPress={toggleSwitch}
        />
      </View>
      {!switching && (
        <>
          <Text style={styles.tagLine}>
            {getUserName()} Add your trip details to start earning money
          </Text>
          <TouchableOpacity
            style={styles.createButtonContainer}
            onPress={() => {
              if (alertKyc.isKycDone) {
                return navigation.navigate('TRAddTravelDetailsFormScreen');
              }
              alertKyc.openAlert();
            }}>
            <Text style={styles.btnText}>Create Trip</Text>
          </TouchableOpacity>
          {orders?.length
            ? orders.map(order => (
                <ORMakeOfferCard
                  key={order.id}
                  data={order}
                  isOfferSent={isOfferSent(order)}
                  orderMakeOfferHandler={orderMakeOfferHandler}
                />
              ))
            : null}
          <View style={{height: 100}} />
        </>
      )}
      {loading || switching ? (
        <ActivityIndicator
          size={'large'}
          color={'white'}
          style={{marginTop: 24}}
        />
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
    backgroundColor: 'black',
  },
  tagLine: {
    fontSize: FontSizes.large - 4,
    color: 'white',
    fontFamily: Fonts.EloquiaDisplayExtraBold,
    lineHeight: 40,
  },
  dateAndTimeContainer: {
    flexDirection: 'row',
  },
  switch: {
    fontSize: FontSizes.medium - 4,
    color: 'white',
    fontFamily: Fonts.EloquiaDisplayExtraBold,
    marginRight: 8,
  },
  createButtonContainer: {
    backgroundColor: Color.ThemePurple,
    padding: 10,
    marginVertical: 30,
  },
  btnText: {
    color: '#ffffff',
    textAlign: 'center',
    borderRadius: 20,
    fontSize: 20,
  },
});

export default TRCreateTripScreen;
