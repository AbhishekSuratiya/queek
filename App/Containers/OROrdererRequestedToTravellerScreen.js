import {ScrollView, StyleSheet, View} from 'react-native';
import * as React from 'react';
import {useCallback, useEffect, useState} from 'react';
import ORTRRequestedOrderCard from '../Components/ORTRRequestedOrderCard';
import {useSelector} from 'react-redux';
import {getUserDetails} from '../redux/selectors/user';
import {getRequestedTravellersByUserId} from '../handlers/travel';
import {useFocusEffect} from '@react-navigation/native';

export const TRIP_STATUS = {
  ACCEPTED: 'ACCEPTED',
  PENDING: 'PENDING',
  REJECTED: 'REJECTED',
};

function OROrdererRequestedToTravellerScreen() {
  const [requestedTrips, setRequestedTrips] = useState([]);
  const user = useSelector(getUserDetails);

  useFocusEffect(
    useCallback(() => {
      getRequestedTravellersByUserId(user?._id).then(data => {
        setRequestedTrips(data);
      });
    }, []),
  );

  const getStatus = trip => {
    if (trip.isPicked) {
      if (trip.pickedBy === user?._id) {
        return TRIP_STATUS.ACCEPTED;
      }
      return TRIP_STATUS.REJECTED;
    } else if (
      trip?.rejectedOrderersId?.length &&
      trip?.rejectedOrderersId.includes(user?._id)
    ) {
      return TRIP_STATUS.REJECTED;
    }
    return TRIP_STATUS.PENDING;
  };

  return (
    <ScrollView style={styles.container}>
      {requestedTrips.length
        ? requestedTrips.map(trip => (
            <ORTRRequestedOrderCard
              key={trip.id}
              data={trip}
              isTrip
              status={getStatus(trip)}
            />
          ))
        : null}
      <View style={{height: 100}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
});

export default OROrdererRequestedToTravellerScreen;
