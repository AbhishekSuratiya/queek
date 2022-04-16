import {ScrollView, StyleSheet, View} from 'react-native';
import * as React from 'react';
import ORCreatedOrderCard from '../Components/ORCreatedOrderCard';
import {useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {getUserDetails} from '../redux/selectors/user';
import {getOrdersById} from '../handlers/order';
import TripCard from '../Components/TripCard';
import {getTravellersByUserApi} from '../api/travel';
import {useFocusEffect} from '@react-navigation/native';

function TRCreatedTripScreen() {
  const [trips, setTrips] = useState([]);
  const user = useSelector(getUserDetails);

  useFocusEffect(
    useCallback(() => {
      getTravellersByUserApi(user._id).then(data => {
        setTrips(data);
      });
    }, []),
  );

  return (
    <ScrollView style={styles.container}>
      {trips?.length
        ? trips.map(trip => (
            <ORCreatedOrderCard data={trip} isTrip key={trip.id} />
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

export default TRCreatedTripScreen;
