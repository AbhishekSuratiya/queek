import {Image, StyleSheet, Text, View} from 'react-native';
import * as React from 'react';
import Color from '../Theme/Color';
import Fonts from '../Theme/Fonts';
import FontSizes from '../Theme/FontSizes';
import Button from './Button';
import {getDateOrTimeFromNow, getStringDate} from '../utils';
import {useContext} from 'react';
import {UserTypeContext} from '../context/userType';

const HEADER_HEIGHT = 44;

function ORMakeOfferCard({
  onPress,
  containerStyle,
  data,
  isTrip = false,
  orderMakeOfferHandler,
  travelMakeOfferHandler,
  isOfferSent,
}) {
  const {isOrderer} = useContext(UserTypeContext);
  const makeOfferHandler = () => {
    if (!isTrip) {
      orderMakeOfferHandler(data);
    } else {
      travelMakeOfferHandler(data);
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
        {/*<View>*/}
        {/*  <Image source={{uri: 'https://picsum.photos/200'}} style={styles.itemImage}/>*/}
        {/*</View>*/}
        <View style={{flex: 1, justifyContent: 'space-between'}}>
          {!isOrderer ? (
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
                {isTrip ? 'Travelling' : 'Deliver'} from -{' '}
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
                {isTrip ? 'Travelling' : 'Deliver'} to -{' '}
              </Text>
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={1}
                style={styles.travelDetails}>
                {data.destination}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.travelDetailsTitle}>Before - </Text>
              <Text style={styles.travelDetails}>
                {getStringDate(data.beforeDate)}
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

      <Button
        onPress={() => !isOfferSent && makeOfferHandler()}
        text={isOfferSent ? 'Offer Sent' : 'Make offer'}
        containerStyle={{
          marginTop: 16,
          ...(isOfferSent ? styles.offerSentStyle : {}),
        }}
      />
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
    fontSize: FontSizes.small,
    color: 'white',
    marginBottom: 5,
    fontFamily: Fonts.Foundation,
  },
  travelDetailsTitle: {
    fontSize: FontSizes.small,
    color: Color.LightGrey1,
    fontFamily: Fonts.Feather,
  },
  travelDetails: {
    flex: 1,
    fontSize: FontSizes.small,
    color: 'white',
    fontFamily: Fonts.Feather,
    textTransform: 'capitalize',
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
  offerSentStyle: {
    backgroundColor: Color.GREEN,
  },
});

export default ORMakeOfferCard;
