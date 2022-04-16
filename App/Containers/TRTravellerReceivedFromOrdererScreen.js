import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import * as React from 'react';
import ORTRReceivedOrderCard from '../Components/ORTRReceivedOrderCard';
import {useCallback, useEffect, useState} from 'react';
import {getTripsReceivedFromOrderers} from '../handlers/travel';
import {useSelector} from 'react-redux';
import {getUserDetails} from '../redux/selectors/user';
import {updateOrderApi} from '../api/order';
import {updateTravellerApi} from '../api/travel';
import {TRIP_STATUS} from './OROrdererRequestedToTravellerScreen';
import {useFocusEffect} from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
});

function TRTravellerReceivedFromOrdererScreen() {
  const [receivedTrips, setReceivedTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector(getUserDetails);

  const fetchTripsReceivedFromOrderers = () => {
    getTripsReceivedFromOrderers(user._id).then(data => setReceivedTrips(data));
  };

  const onAcceptOrder = async (trip, orderer) => {
    const updateField = {
      isPicked: true,
      pickedBy: orderer._id,
    };
    setLoading(true);
    try {
      updateTravellerApi(trip.id, updateField).then(() => {
        fetchTripsReceivedFromOrderers();
        setLoading(false);
        Alert.alert('Trip Accepted!');
      });
    } catch (error) {
      setLoading(false);
      console.error(error);
      Alert.alert('Something went wrong, try again.');
    }
  };

  const onRejectOrder = async (order, orderer) => {
    const newRejectedOrderersId = [
      ...(order.rejectedOrderersId ?? []),
      orderer._id,
    ];
    setLoading(true);
    try {
      updateTravellerApi(order.id, {
        rejectedOrderersId: newRejectedOrderersId,
      }).then(() => {
        fetchTripsReceivedFromOrderers();
        setLoading(false);
        Alert.alert('Trip Rejected!');
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
      Alert.alert('Something went wrong, try again.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTripsReceivedFromOrderers();
    }, []),
  );

  const getStatus = trip => {
    if (trip.isPicked) {
      if (trip.pickedBy === user._id) {
        return TRIP_STATUS.ACCEPTED;
      }
      return TRIP_STATUS.REJECTED;
    } else if (
      trip?.rejectedOrderersId?.length &&
      trip?.rejectedOrderersId.includes(user._id)
    ) {
      return TRIP_STATUS.REJECTED;
    }
    return TRIP_STATUS.PENDING;
  };

  return (
    <ScrollView style={styles.container}>
      {receivedTrips && receivedTrips.length
        ? receivedTrips.map(trip => (
            <ORTRReceivedOrderCard
              isTrip
              data={trip}
              key={trip.id}
              onAcceptOrder={onAcceptOrder}
              onRejectOrder={onRejectOrder}
              status={getStatus(trip)}
            />
          ))
        : null}
      <View style={{height: 100}} />
    </ScrollView>
  );
}

export default TRTravellerReceivedFromOrdererScreen;
