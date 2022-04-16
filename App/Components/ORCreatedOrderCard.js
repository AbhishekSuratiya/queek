import {Image, StyleSheet, Text, View} from 'react-native';
import * as React from 'react';
import Color from '../Theme/Color';
import Fonts from '../Theme/Fonts';
import FontSizes from '../Theme/FontSizes';
import {getDateOrTimeFromNow, getStringDate} from '../utils';
import {useContext} from 'react';
import {UserTypeContext} from '../context/userType';

const HEADER_HEIGHT = 44;

function ORCreatedOrderCard({onPress, containerStyle, data, isTrip}) {
  const {isOrderer} = useContext(UserTypeContext);

  if (!data) {
    return null;
  }
  return (
    <View onPress={onPress} style={{...styles.container, ...containerStyle}}>
      <View style={styles.detailsContainer}>
        <View>
          <Image
            source={{uri: data.productImageUrl ?? 'https://picsum.photos/200'}}
            style={styles.itemImage}
          />
        </View>
        <View style={{flex: 1, justifyContent: 'space-between'}}>
          {isOrderer && (
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={styles.productName}>
              {data?.productName}
            </Text>
          )}
          <View>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={[
                  styles.createdTime,
                  isOrderer
                    ? {}
                    : {fontSize: 16, color: 'white', marginBottom: 6},
                ]}>
                Created {getDateOrTimeFromNow(data.postedDate)}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.travelDetailsTitle}>Deliver from </Text>
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={1}
                style={styles.travelDetails}>
                {data.from}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.travelDetailsTitle}>Deliver to </Text>
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={1}
                style={styles.travelDetails}>
                {data.destination}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.travelDetailsTitle}>Before </Text>
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
    // marginTop: 24,
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
  createdTime: {
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
});

export default ORCreatedOrderCard;
