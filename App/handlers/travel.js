import {travellerSchema} from '../constants/schema';
import {Alert} from 'react-native';
import {
  addTravelApi,
  getTravellersApi,
  getTravellersByUserApi,
  getTravellersByUserIdApi,
} from '../api/travel';
import {getUsersByIdsApi, updateUserApi} from '../api/users';
import {mergeUserIntoCollection} from '../utils';
import {getCollectionWithPropDetails} from './order';

export const addTravel = async (formData, user) => {
  try {
    const params = travellerSchema({
      ...formData,
      postedBy: user._id,
      travelDate: formData.date,
      postedDate: new Date(),
    });
    console.log('Params', params);
    const res = await addTravelApi(params);
    await updateUserApi(user._id, {
      trips: {[res.id]: {_id: res.id, requestedOffers: {}}},
    });
    Alert.alert('Trip Created');
  } catch (error) {
    console.error(error);
    Alert.alert(error.message);
  }
};

export const getTravellers = async () => {
  try {
    // fetch travellers
    let data = await getTravellersApi();
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

export const getRequestedTravellersByUserId = async id => {
  try {
    // fetch travellers by user id
    let data = await getTravellersByUserIdApi(id);
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

export const getTripsReceivedFromOrderers = async id => {
  try {
    let data = await getTravellersByUserApi(id);

    if (data && data.length) {
      const receivedTrips = data.filter(d => !!d.requestedOrderersId.length);

      const requestedOrderersId = [
        ...new Set(receivedTrips.map(t => t.requestedOrderersId).flat()),
      ].filter(Boolean);

      console.log('USERS', requestedOrderersId);

      if (requestedOrderersId.length) {
        // fetch users
        const users = await getUsersByIdsApi(requestedOrderersId);

        // append user data to orders
        data = getCollectionWithPropDetails(receivedTrips, users, 'orderers');
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
