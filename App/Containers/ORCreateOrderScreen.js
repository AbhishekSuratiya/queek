import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
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
import ORMakeOfferCard from '../Components/ORMakeOfferCard';
import FontSizes from '../Theme/FontSizes';
import Fonts from '../Theme/Fonts';
import Color from '../Theme/Color';
import {getTravellers} from '../handlers/travel';
import {useSelector} from 'react-redux';
import {getUserDetails} from '../redux/selectors/user';
import {updateTravellerApi} from '../api/travel';
import {UserType, UserTypeContext} from '../context/userType';
import {useKycAlertContext} from '../context/KycAlert';
import Button from '../Components/Button';

function ORCreateOrderScreen({navigation}) {
  const [traveller, setTravellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [switching, setSwitching] = useState(false);
  const user = useSelector(getUserDetails);
  const {isOrderer, setUserType} = useContext(UserTypeContext);
  const alertKyc = useKycAlertContext();

  const toggleSwitch = () => {
    setSwitching(true);
    setTimeout(() => {
      setUserType(isOrderer ? UserType.travellerer : UserType.orderer);
      setSwitching(false);
    }, 500);
  };

  const fetchTraveller = () => {
    getTravellers().then(data => {
      setTravellers(data);
    });
  };

  const travelMakeOfferHandler = async trip => {
    if (!alertKyc.isKycDone) {
      return alertKyc.openAlert();
    }

    try {
      setLoading(true);
      const newRequestedOrderersId = [
        ...(trip.requestedOrderersId ?? []),
        user._id,
      ];
      await updateTravellerApi(trip.id, {
        requestedOrderersId: newRequestedOrderersId,
      });
      fetchTraveller();
      setLoading(false);
      Alert.alert('Offer sent!');
    } catch (error) {
      setLoading(false);
      Alert.alert(error.message);
    }
  };

  useEffect(() => {
    fetchTraveller();
  }, []);

  const isOfferSent = order => {
    const {requestedOrderersId} = order;
    if (requestedOrderersId && user) {
      return requestedOrderersId.includes(user._id);
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
          text={'Switch to traveller'}
          onPress={toggleSwitch}
        />
      </View>
      {!switching && (
        <>
          <Text style={styles.tagLine}>
            {getUserName()}Create order for same day delivery
          </Text>
          <TouchableOpacity
            style={styles.createButtonContainer}
            onPress={() => {
              if (alertKyc.isKycDone) {
                return navigation.navigate('ORCreateOrderFormScreen');
              }
              alertKyc.openAlert();
            }}>
            <Text style={styles.btnText}>Create Order</Text>
          </TouchableOpacity>
          {traveller?.length
            ? traveller.map(trip => (
                <ORMakeOfferCard
                  key={trip.id}
                  data={trip}
                  isTrip
                  isOfferSent={isOfferSent(trip)}
                  travelMakeOfferHandler={travelMakeOfferHandler}
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
    padding: 20,
    paddingTop: 0,
    backgroundColor: 'black',
  },
  tagLine: {
    fontSize: FontSizes.large,
    color: 'white',
    fontFamily: Fonts.EloquiaDisplayExtraBold,
    lineHeight: 48,
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

export default ORCreateOrderScreen;
