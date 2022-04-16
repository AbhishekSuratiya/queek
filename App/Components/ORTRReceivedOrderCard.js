import {Alert, Image, StyleSheet, Text, View} from 'react-native';
import * as React from 'react';
import Color from '../Theme/Color';
import Fonts from '../Theme/Fonts';
import FontSizes from '../Theme/FontSizes';
import Button from './Button';
import {ORDER_STATUS} from '../constants';
import {useContext, useState} from 'react';
import Collapsible from 'react-native-collapsible';
import {getStringDate} from '../utils';
import {TRIP_STATUS} from '../Containers/OROrdererRequestedToTravellerScreen';
import {UserTypeContext} from '../context/userType';
import {updateTravellerApi} from '../api/travel';
import {useNavigation} from '@react-navigation/native';
import {updateOrderApi} from '../api/order';
import {AirbnbRating} from 'react-native-ratings';

const HEADER_HEIGHT = 44;

const getRejectedProperty = isTrip =>
  isTrip ? 'rejectedOrderersId' : 'rejectedTravellersId';
const getRequestedProperty = isTrip =>
  isTrip ? 'requestedOrderersId' : 'requestedTravellersId';

const isRejectedCompletely = (data, isTrip) => {
  const rejectedIdsSize = data?.[getRejectedProperty(isTrip)].length;
  return data?.[getRequestedProperty(isTrip)]?.length === rejectedIdsSize;
};

const isUserRejected = (data, isTrip, user) => {
  const rejectedIds = data?.[getRejectedProperty(isTrip)] ?? [];
  return rejectedIds.length ? rejectedIds.includes(user?._id) : false;
};

function ORTRReceivedOrderCard({
  onPress,
  containerStyle,
  status,
  data,
  onAcceptOrder,
  onRejectOrder,
  isTrip,
}) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const {isOrderer} = useContext(UserTypeContext);
  const navigation = useNavigation();

  if (!data || isRejectedCompletely(data, isTrip)) {
    return null;
  }

  const markAsComplete = async () => {
    try {
      await updateOrderApi(data.id, {isCompleted: true});
      navigation.replace('ReviewScreen', {id: data?.pickedBy});
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const requesterItem = requester => {
    if (isUserRejected(data, isTrip, requester)) {
      return null;
    }

    return (
      <View key={requester._id}>
        <View style={styles.separator} />
        <View style={styles.collapsedItem}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={{
                uri: requester.imageUrl
                  ? requester.imageUrl
                  : 'https://picsum.photos/200',
              }}
              style={styles.profileImage}
            />
            <View
              style={{
                justifyContent: 'space-between',
                height: HEADER_HEIGHT,
                alignItems: 'flex-start',
              }}>
              <Text style={styles.requesterName}>{requester.name}</Text>
              {/*<Text style={styles.requestedTime}>requested 20 minutes ago</Text>*/}
              {requester.overallRating ? (
                <AirbnbRating
                  showRating={false}
                  count={5}
                  defaultRating={requester?.overallRating}
                  size={10}
                  onFinishRating={() => null}
                />
              ) : (
                <Text style={[styles.requesterName, {fontSize: 14}]}>
                  No rating yet
                </Text>
              )}
            </View>
          </View>

          <View style={{flexDirection: 'row'}}>
            <Button
              onPress={() => {
                onAcceptOrder(data, requester);
                setIsCollapsed(true);
              }}
              text={'Accept'}
              containerStyle={{
                ...styles.acceptRejectButtons,
                marginRight: 6,
                backgroundColor: Color.GREEN,
              }}
            />
            <Button
              onPress={() => {
                onRejectOrder(data, requester);
                setIsCollapsed(true);
              }}
              text={'Reject'}
              containerStyle={{
                ...styles.acceptRejectButtons,
                marginLeft: 6,
                backgroundColor: Color.RED,
              }}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View onPress={onPress} style={{...styles.container, ...containerStyle}}>
      <View style={styles.detailsContainer}>
        <View>
          <Image
            source={{uri: 'https://picsum.photos/200'}}
            style={styles.itemImage}
          />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: data.productName && 'space-between',
          }}>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={styles.productName}>
            {data.productName}
          </Text>
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
                {isTrip ? 'Travelling Date' : 'Before'}{' '}
              </Text>
              <Text style={styles.travelDetails}>
                {isTrip
                  ? getStringDate(data.travelDate)
                  : getStringDate(data.beforeDate)}
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

      {data?.isPicked ? (
        <>
          <View style={styles.statusContainer}>
            <Text style={styles.statusName}>Status</Text>
            <Text
              style={[styles.statusName, {color: ORDER_STATUS[status].color}]}>
              {ORDER_STATUS[status].text}
            </Text>
          </View>
          <View style={styles.statusContainer}>
            <Text style={styles.statusName}>Contact</Text>
            <Text
              style={[styles.statusName, {color: ORDER_STATUS[status].color}]}>
              {data?.pickedBy}
            </Text>
          </View>
        </>
      ) : (
        <Button
          iconName={isCollapsed ? 'chevron-down' : 'chevron-up'}
          iconColor={'white'}
          iconSize={36}
          onPress={() => setIsCollapsed(!isCollapsed)}
          text={isCollapsed ? 'View travellers' : 'Hide travellers'}
          containerStyle={{marginTop: 16}}
        />
      )}
      <Collapsible collapsed={isCollapsed}>
        {data?.[isTrip ? 'orderers' : 'travellers']?.map(traveller =>
          requesterItem(traveller),
        )}
      </Collapsible>
      {isOrderer && TRIP_STATUS.ACCEPTED === status && !data.isCompleted ? (
        <Button onPress={markAsComplete} text={'Mark as complete'} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: Color.LightGrey2,
    marginTop: 16,
  },
  collapsedItem: {
    flexDirection: 'column',
    marginTop: 16,
  },
  requesterName: {
    fontSize: FontSizes.medium - 6,
    color: 'white',
    fontFamily: Fonts.Foundation,
    alignItems: 'center',
    justifyContent: 'space-between',
    textTransform: 'capitalize',
  },
  container: {
    width: '100%',
    padding: 16,
    borderRadius: 6,
    borderColor: Color.LightGrey3,
    borderWidth: 1,
    marginTop: 16,
  },
  acceptRejectButtons: {
    marginTop: 16,
    width: 1,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsContainer: {
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
    marginTop: 12,
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
export default ORTRReceivedOrderCard;
