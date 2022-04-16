import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import * as React from 'react';
import ORTRReceivedOrderCard from '../Components/ORTRReceivedOrderCard';
import {useCallback, useEffect, useState} from 'react';
import {getOrdersReceivedFromTravellers} from '../handlers/order';
import {useSelector} from 'react-redux';
import {getUserDetails} from '../redux/selectors/user';
import {updateOrderApi} from '../api/order';
import {TRIP_STATUS} from './OROrdererRequestedToTravellerScreen';
import {useFocusEffect} from '@react-navigation/native';

function OROrdererReceivedFromTravellerScreen() {
  const [receivedTravellersRequest, setReceivedTravellersRequest] = useState(
    [],
  );
  const [loading, setLoading] = useState(false);
  const user = useSelector(getUserDetails);

  const fetchOrdersReceivedFromTravellers = () => {
    getOrdersReceivedFromTravellers(user?._id).then(data =>
      setReceivedTravellersRequest(data),
    );
  };

  const onAcceptOrder = async (order, traveller) => {
    const updateField = {
      isPicked: true,
      pickedBy: traveller._id,
    };
    setLoading(true);
    try {
      updateOrderApi(order.id, updateField).then(() => {
        fetchOrdersReceivedFromTravellers();
        setLoading(false);
        Alert.alert('Order Accepted!');
      });
    } catch (error) {
      setLoading(false);
      console.error(error);
      Alert.alert('Something went wrong, try again.');
    }
  };

  const onRejectOrder = async (order, traveller) => {
    const newRejectedTravellersId = [
      ...(order.rejectedTravellersId ?? []),
      traveller._id,
    ];
    setLoading(true);
    try {
      updateOrderApi(order.id, {
        rejectedTravellersId: newRejectedTravellersId,
      }).then(() => {
        fetchOrdersReceivedFromTravellers();
        setLoading(false);
        Alert.alert('Order Rejected!');
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
      Alert.alert('Something went wrong, try again.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrdersReceivedFromTravellers();
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
      {receivedTravellersRequest.length
        ? receivedTravellersRequest.map(data => (
            <ORTRReceivedOrderCard
              key={data.id}
              data={data}
              status={getStatus(data)}
              onAcceptOrder={onAcceptOrder}
              onRejectOrder={onRejectOrder}
            />
          ))
        : null}

      <View style={{height: 100}} />
      {loading ? <ActivityIndicator /> : null}
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

export default OROrdererReceivedFromTravellerScreen;
