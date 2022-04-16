import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import * as React from 'react';
import ORCreatedOrderCard from '../Components/ORCreatedOrderCard';
import {useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {getUserDetails} from '../redux/selectors/user';
import {getOrdersById} from '../handlers/order';
import {useFocusEffect} from '@react-navigation/native';

function ORCreatedOrderScreen() {
  const [orders, setOrders] = useState([]);
  const user = useSelector(getUserDetails);

  useFocusEffect(
    useCallback(() => {
      getOrdersById(user?._id).then(data => {
        setOrders(data);
      });
    }, []),
  );

  return (
    <ScrollView style={styles.container}>
      {orders?.length
        ? orders.map(order => (
            <ORCreatedOrderCard key={order.id} data={order} />
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

export default ORCreatedOrderScreen;
