import {Alert, Image, StyleSheet, Text, View} from 'react-native';
import * as React from 'react';
import Color from '../Theme/Color';
import Fonts from '../Theme/Fonts';
import FontSizes from '../Theme/FontSizes';
import Button from './Button';
import {ORDER_STATUS} from '../constants';
import {getDateOrTimeFromNow, getStringDate} from '../utils';
import {TRIP_STATUS} from '../Containers/OROrdererRequestedToTravellerScreen';
import {useContext} from 'react';
import {UserTypeContext} from '../context/userType';
import {updateTravellerApi} from '../api/travel';
import {useNavigation} from '@react-navigation/native';

const HEADER_HEIGHT = 44;

function ORTRRequestedOrderCard({
  onPress,
  containerStyle,
  status = 'PENDING',
  data,
  isTrip = false,
}) {
  const {isOrderer} = useContext(UserTypeContext);
  const navigation = useNavigation();
  if (!data) {
    return null;
  }

  const markAsComplete = async () => {
    try {
      await updateTravellerApi(data.id, {isCompleted: true});
      navigation.replace('ReviewScreen', {id: data.postedBy});
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <View onPress={onPress} style={{...styles.container, ...containerStyle}}>
      <View style={styles.header}>
        <Image
          source={{
            uri: data?.user?.imageUrl
              ? data.user.imageUrl
              : 'https://picsum.photos/200',
          }}
          style={styles.profileImage}
        />
        <View style={{justifyContent: 'space-between', height: HEADER_HEIGHT}}>
          <Text style={styles.travellerName}>{data?.user?.name}</Text>
          <Text style={styles.requestedTime}>
            requested {getDateOrTimeFromNow(data.postedDate)}
          </Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View>
          <Image
            source={{uri: 'https://picsum.photos/200'}}
            style={styles.itemImage}
          />
        </View>
        <View style={{flex: 1, justifyContent: 'space-between'}}>
          {!isTrip ? (
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={styles.productName}>
              {data?.productName}
            </Text>
          ) : null}
          <View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.travelDetailsTitle}>
                {!isTrip ? 'Deliver' : 'Travelling'} from{' '}
              </Text>
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={1}
                style={styles.travelDetails}>
                {data.from}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.travelDetailsTitle}>
                {!isTrip ? 'Deliver' : 'Travelling'} to{' '}
              </Text>
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={1}
                style={styles.travelDetails}>
                {data.destination}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.travelDetailsTitle}>
                {!isTrip ? 'Deliver' : 'Travelling'} date{' '}
              </Text>
              <Text style={styles.travelDetails}>
                {getStringDate(data.travelDate)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {isTrip ? (
        <View style={styles.travelerReward}>
          <Text style={styles.travelerRewardText}>Traveller reward</Text>
          <Text style={styles.reward}>{data.rewardPrice}</Text>
        </View>
      ) : null}

      <View style={styles.statusContainer}>
        <Text style={styles.statusName}>Status</Text>
        <Text style={[styles.statusName, {color: ORDER_STATUS[status].color}]}>
          {ORDER_STATUS[status].text}
        </Text>
      </View>

      {TRIP_STATUS.ACCEPTED === status ? (
        <View style={styles.statusContainer}>
          <Text style={styles.statusName}>Contact Traveller</Text>
          <Text
            style={[styles.statusName, {color: ORDER_STATUS[status].color}]}>
            {data?.user?.id}
          </Text>
        </View>
      ) : null}
      {isOrderer && TRIP_STATUS.ACCEPTED === status && !data.isCompleted ? (
        <Button onPress={markAsComplete} text={'Mark as complete'} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
    borderRadius: 6,
    borderColor: Color.LightGrey3,
    borderWidth: 1,
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsContainer: {
    marginTop: 24,
    flexDirection: 'row',
    flex: 1,
  },
  productName: {
    fontSize: FontSizes.small - 2,
    color: 'white',
    fontFamily: Fonts.Foundation,
  },
  travelDetailsTitle: {
    fontSize: FontSizes.small - 4,
    color: Color.LightGrey1,
    fontFamily: Fonts.Feather,
  },
  travelDetails: {
    fontSize: FontSizes.small - 4,
    color: 'white',
    fontFamily: Fonts.Feather,
    flex: 1,
  },
  profileImage: {
    width: HEADER_HEIGHT,
    height: HEADER_HEIGHT,
    borderRadius: 200,
    marginRight: 16,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 16,
    borderColor: Color.LightGrey3,
    borderWidth: 1,
  },
  travellerName: {
    fontSize: FontSizes.medium - 6,
    color: 'white',
    fontFamily: Fonts.Foundation,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reward: {
    fontSize: FontSizes.medium - 6,
    color: 'white',
    fontFamily: Fonts.Foundation,
    justifyContent: 'space-between',
  },
  requestedTime: {
    fontSize: FontSizes.small - 1,
    color: Color.LightGrey1,
    fontFamily: Fonts.FontAwesome,
  },
  travelerRewardText: {
    fontSize: FontSizes.small,
    color: Color.LightGrey1,
    fontFamily: Fonts.FontAwesome,
  },
  travelerReward: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusContainer: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusName: {
    fontSize: FontSizes.small,
    color: 'white',
    fontFamily: Fonts.Foundation,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 4,
  },
});

export default ORTRRequestedOrderCard;
