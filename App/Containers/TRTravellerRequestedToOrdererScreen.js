import {ScrollView, StyleSheet, View} from 'react-native';
import * as React from 'react';
import ORTRRequestedOrderCard from '../Components/ORTRRequestedOrderCard';
import {useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {getUserDetails} from '../redux/selectors/user';
import {getRequestedOrdersByUserId} from '../handlers/order';
import {TRIP_STATUS} from './OROrdererRequestedToTravellerScreen';
import {useFocusEffect} from '@react-navigation/native';

function TRTravellerRequestedToOrdererScreen() {
  const [requestedOrders, setRequestedOrders] = useState([]);
  const user = useSelector(getUserDetails);

  useFocusEffect(
    useCallback(() => {
      getRequestedOrdersByUserId(user._id).then(data =>
        setRequestedOrders(data),
      );
    }, []),
  );

  const getStatus = order => {
    if (order.isPicked) {
      if (order.pickedBy === user._id) {
        return TRIP_STATUS.ACCEPTED;
      }
      return TRIP_STATUS.REJECTED;
    } else if (
      order?.rejectedTravellersId?.length &&
      order?.rejectedTravellersId.includes(user._id)
    ) {
      return TRIP_STATUS.REJECTED;
    }
    return TRIP_STATUS.PENDING;
  };

  return (
    <ScrollView style={styles.container}>
      {requestedOrders.length
        ? requestedOrders.map(order => (
            <ORTRRequestedOrderCard
              key={order.id}
              data={order}
              status={getStatus(order)}
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

export default TRTravellerRequestedToOrdererScreen;
