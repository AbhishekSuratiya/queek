import moment from 'moment';
import {DIGIO_CONSTANTS} from '../constants';
import base64 from 'react-native-base64';
import {getUsersByIdsApi} from '../api/users';
import {keyBy} from 'lodash/fp';
import {
  AlternateNames,
  Column,
  Rows,
  statesLatLng,
} from '../constants/distance';
import * as geolib from 'geolib';

const MODE = {
  train: 'train',
  car: 'car',
  plane: 'plane',
};
const DEFAULT_PRICE = 0;

const isValidDateAndTimer = d => {
  if (Object.prototype.toString.call(d) === '[object Date]') {
    // it is a date
    if (isNaN(d)) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
};

export const getStringDate = date => {
  return date ? moment(date.toDate()).format('ll') : '';
};

export const getDateOrTimeFromNow = date => {
  return moment(date.toDate()).startOf('hour').fromNow();
};

export const isValidFormValues = formData => {
  let errorMessage = '';
  let isError = false;
  for (let key of Object.keys(formData)) {
    if (key === 'imageUrl' && formData[key].length === 0) {
      isError = true;
      errorMessage = `Please upload image`;
      break;
    } else if (key === 'date' && !isValidDateAndTimer(formData[key])) {
      isError = true;
      errorMessage = 'Invalid date and time';
      break;
    } else if (formData[key].length === 0) {
      isError = true;
      errorMessage = `Invalid ${key} field`;
      break;
    }
  }
  return {isError, errorMessage};
};

export const fetchDigioBaseUrl = `${
  DIGIO_CONSTANTS[process.env.NODE_ENV].BASE_URL
}/client/kyc/v2/`;

export const encodeBASE64 = code => {
  return base64.encode(code);
};

export const getCollectionWithUserDetails = (collection, users) => {
  const usersMap = keyBy('_id', users);
  return collection.map(col => ({
    ...col,
    user: usersMap[col.postedBy],
  }));
};

export const mergeUserIntoCollection = async data => {
  //get users Id
  const usersId = [...new Set(data.map(d => d.postedBy))];

  // fetch user based on travellers
  const users = await getUsersByIdsApi(usersId);

  // append user data to travellers
  return getCollectionWithUserDetails(data, users);
};

export const toRupees = price => `₹${price}`;

const mapStateName = state => {
  return AlternateNames[state] ?? state;
};

const getLatLong = state => {
  const coordinates = statesLatLng?.[state];
  return coordinates
    ? {
        latitude: coordinates.lat,
        longitude: coordinates.lon,
      }
    : null;
};

const getDistance = (from, destination) => {
  const fromCords = getLatLong(from);
  const destCords = getLatLong(destination);

  if (fromCords && destCords) {
    return geolib.getPreciseDistance(fromCords, destCords);
  }
  return 0;
};

export const calculatePriceByDistance = (from, destination, mode) => {
  let distance = getDistance(from, destination);

  if (distance) {
    distance = Math.ceil(distance / 1000);
    let rate = 0;
    switch (mode) {
      case MODE.plane:
        if (distance <= 400) {
          rate = 1.5;
        } else if (distance > 400 && distance <= 1000) {
          rate = 0.8;
        } else rate = 0.6;
        break;
      case MODE.car:
        if (distance <= 400) {
          rate = 1.5;
        } else rate = 1.0;
        break;
      case MODE.train:
        rate = 1.0;
    }
    return Math.ceil(distance * rate);
  }
  return DEFAULT_PRICE;
};
