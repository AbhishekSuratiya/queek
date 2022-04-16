import {Image, StyleSheet, Text, View} from "react-native";
import * as React from "react";
import Color from "../Theme/Color";
import Fonts from "../Theme/Fonts";
import FontSizes from "../Theme/FontSizes";
import Button from "./Button";
import Collapsible from 'react-native-collapsible';
import {useState} from "react";

const HEADER_HEIGHT = 44

function TripCard({onPress, containerStyle}) {
  const [isCollapsed, setIsCollapsed] = useState(true)


  const requesterItem = (el) => {
    return (
      <View key={el}>
        <View style={styles.separator}/>
        <View style={styles.collapsedItem}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={{uri: 'https://picsum.photos/200'}} style={styles.profileImage}/>
            <View style={{justifyContent: 'space-between', height: HEADER_HEIGHT}}>
              <Text style={styles.requesterName}>Nick Gibson</Text>
              <Text style={styles.requestedTime}>requested 20 minutes ago</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', marginTop: 16, width: '100%'}}>
            <View style={{flex: 1}}>
              <Image source={{uri: 'https://picsum.photos/200'}} style={styles.itemImage}/>
            </View>
            <View style={{paddingRight: 16, paddingLeft: 80, flexGrow: 1}}>
              <Text numberOfLines={3} ellipsizeMode='tail' style={styles.productName}>Lowrance HDC Carbon 12 Fish
                Finder/ChartPlotter
                Combo
              </Text>
              <View style={styles.travelerReward}>
                <Text style={styles.travelerRewardText}>Traveller reward</Text>
                <Text style={styles.reward}>$120</Text>
              </View>
            </View>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Button onPress={null} text={'Accept'}
                    containerStyle={{...styles.acceptRejectButtons, marginRight: 6, backgroundColor: Color.GREEN}}/>
            <Button onPress={null} text={'Reject'}
                    containerStyle={{...styles.acceptRejectButtons, marginLeft: 6, backgroundColor: Color.RED}}/>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View onPress={onPress} style={{...styles.container, ...containerStyle}}>
      <View style={styles.detailsContainer}>
        <View style={{flex: 1, justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row', marginBottom: 6}}>
            <Text style={styles.travelDetailsTitle}>Deliver to </Text>
            <Text style={styles.travelDetails}>Delhi</Text>
          </View>
          <View style={{flexDirection: 'row', marginBottom: 6}}>
            <Text style={styles.travelDetailsTitle}>Deliver from </Text>
            <Text style={styles.travelDetails}>London</Text>
          </View>
          <View style={{flexDirection: 'row', marginBottom: 6}}>
            <Text style={styles.travelDetailsTitle}>Before </Text>
            <Text style={styles.travelDetails}>Feb 22, 2020</Text>
          </View>
        </View>
      </View>

      <Button
        iconName={isCollapsed ? 'chevron-down' : 'chevron-up'}
        iconColor={'white'}
        iconSize={36}
        onPress={() => setIsCollapsed(!isCollapsed)}
        text={isCollapsed ? 'View orders' : 'Hide requesters'}
        containerStyle={{marginTop: 16}}
      />
      <Collapsible collapsed={isCollapsed}>
        {[1, 4].map(el => requesterItem(el))}
      </Collapsible>
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
  acceptRejectButtons: {
    marginTop: 16,
    width: 1,
    flexGrow: 1
  },
  container: {
    width: '100%',
    padding: 16,
    borderRadius: 6,
    borderColor: Color.LightGrey3,
    borderWidth: 1,
    marginBottom: 16
  },
  collapsedItem: {
    flexDirection: 'column',
    marginTop: 16,
  },
  detailsContainer: {
    // marginTop: 24,
    flexDirection: 'row',
    flex: 1
  },
  productName: {
    fontSize: FontSizes.small - 2,
    color: 'black',
    fontFamily: Fonts.Foundation,
  },
  travelDetailsTitle: {
    fontSize: FontSizes.medium - 4,
    color: Color.LightGrey1,
    fontFamily: Fonts.Feather,
  },
  travelDetails: {
    fontSize: FontSizes.medium - 4,
    color: 'black',
    fontFamily: Fonts.Feather
  },
  profileImage: {
    width: HEADER_HEIGHT,
    height: HEADER_HEIGHT,
    borderRadius: 200,
    marginRight: 16
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 16,
    borderColor: Color.LightGrey3,
    borderWidth: 1
  },
  requesterName: {
    fontSize: FontSizes.medium - 6,
    color: 'black',
    fontFamily: Fonts.Foundation,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  reward: {
    fontSize: FontSizes.medium - 6,
    color: 'black',
    fontFamily: Fonts.Foundation,
    justifyContent: 'space-between'
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
    justifyContent: 'space-between'
  }
});

export default TripCard