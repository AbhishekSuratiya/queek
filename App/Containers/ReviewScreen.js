import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as React from 'react';
import {useCallback, useState} from 'react';
import {AirbnbRating} from 'react-native-ratings';
import FontSizes from '../Theme/FontSizes';
import Fonts from '../Theme/Fonts';
import Color from '../Theme/Color';
import Button from '../Components/Button';
import {addReview} from '../api/review';
import {useSelector} from 'react-redux';
import {getUserDetails} from '../redux/selectors/user';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {addReviewHandler} from '../handlers/review';

function ReviewScreen({route}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const storedUser = useSelector(getUserDetails);
  const navigation = useNavigation();

  const handleSubmit = async () => {
    const params = {
      rating,
      description: comment,
      submittedFor: route.params.id, //ID passed down from the component
      submittedBy: storedUser._id,
    };

    try {
      await addReviewHandler(params);
      Alert.alert('Thanks for using Queek');
      navigation.replace('BottomTabScreen');
    } catch (error) {
      console.log(error);
      Alert.alert(error.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      Alert.alert('Write a review for Traveller');
    }, []),
  );

  return (
    <View style={{padding: 16, alignItems: 'center'}}>
      <View
        style={{
          alignItems: 'center',
          marginBottom: 24,
        }}>
        <Text style={styles.textStyle}>Rate Us</Text>
        <AirbnbRating
          count={5}
          defaultRating={rating}
          size={25}
          onFinishRating={setRating}
        />
      </View>
      <View
        style={{
          alignItems: 'center',
          marginBottom: 48,
        }}>
        <Text style={styles.textStyle}>Comments</Text>
        <TextInput
          multiline={true}
          value={comment}
          onChangeText={setComment}
          style={styles.input}
        />
      </View>
      <Button
        text={'Submit'}
        containerStyle={{width: 200, backgroundColor: Color.GREEN}}
        onPress={handleSubmit}
      />
    </View>
  );
}

export default ReviewScreen;

const styles = StyleSheet.create({
  input: {
    height: 200,
    backgroundColor: Color.LightGrey4,
    width: 300,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Color.LightGrey3,
  },
  textStyle: {
    fontSize: FontSizes.medium - 2,
    color: 'black',
    fontFamily: Fonts.EloquiaDisplayExtraBold,
    lineHeight: 50,
  },
});
