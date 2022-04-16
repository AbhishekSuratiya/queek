import {Alert} from 'react-native';
import {
  addOrderApi,
  getOrderApi,
  getOrdersByIdApi,
  getOrdersByUserIdApi,
} from '../api/order';
import {orderSchema} from '../constants/schema';
import {mergeUserIntoCollection} from '../utils';
import {keyBy} from 'lodash/fp';
import {getUsersByIdsApi} from '../api/users';

export const addOrder = async (formData, user) => {
  try {
    const params = orderSchema({
      ...formData,
      postedBy: user._id,
      beforeDate: formData.date,
      postedDate: new Date(),
      productName: formData.title,
      productImageUrl: formData.imageUrl,
    });
    console.log('Params', params);
    const data = await addOrderApi(params);
    Alert.alert('Order Created');
  } catch (error) {
    console.error(error);
    Alert.alert(error.message);
  }
};

export const getOrders = async () => {
  try {
    let data = await getOrderApi();
    data = data.filter(d => d.postedBy);

    if (data && data.length) {
      data = await mergeUserIntoCollection(data);
    }
    return data;
  } catch (error) {
    console.error(error);
    Alert.alert(error.message);
  }
};

export const getOrdersById = async id => {
  try {
    const data = await getOrdersByIdApi(id);
    console.log('Data', data);
    return data;
  } catch (error) {
    console.error(error);
    Alert.alert(error.message);
  }
};

export const getCollectionWithPropDetails = (collection, users, property) => {
  const usersMap = keyBy('_id', users);
  return collection.map(col => ({
    ...col,
    [property]: col[
      property === 'travellers'
        ? 'requestedTravellersId'
        : 'requestedOrderersId'
    ].map(id => usersMap[id]),
  }));
};

export const getOrdersReceivedFromTravellers = async id => {
  try {
    let data = await getOrdersByIdApi(id);

    if (data && data.length) {
      const receivedOrders = data.filter(d => !!d.requestedTravellersId.length);

      const requestedTravellersId = [
        ...new Set(receivedOrders.map(o => o.requestedTravellersId).flat()),
      ].filter(Boolean);

      if (requestedTravellersId.length) {
        // fetch users
        const users = await getUsersByIdsApi(requestedTravellersId);

        // append user data to orders
        data = getCollectionWithPropDetails(
          receivedOrders,
          users,
          'travellers',
        );
      } else {
        data = [];
      }
    }
    return data;
  } catch (error) {
    console.error(error);
    Alert.alert(error.message);
  }
};

export const getRequestedOrdersByUserId = async id => {
  try {
    // fetch orders by user id
    let data = await getOrdersByUserIdApi(id);
    // Append user
    if (data && data.length) {
      data = await mergeUserIntoCollection(data);
    }
    return data;
  } catch (error) {
    console.error(error);
    Alert.alert(error.message);
  }
};
