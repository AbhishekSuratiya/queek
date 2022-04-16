import React, {useState} from 'react';
import ImageUploader from './ImageUploader';
import AutoSearchInput from './AutoSearchInput';
import Input from './Input';
import Select, {SelectItem} from '@redmin_delishaj/react-native-select/index';
import {Alert, Platform, ScrollView, StyleSheet, View} from 'react-native';
import PseudoInput from './PseudoInput';
import Color from '../Theme/Color';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import Button from './Button';
import mapMyIndia from 'mapmyindia-restapi-react-native-beta/index';
import {isValidFormValues} from '../utils';
import {addOrder} from '../handlers/order';
import {useSelector} from 'react-redux';
import {getUserDetails} from '../redux/selectors/user';
import FontSizes from '../Theme/FontSizes';
import Fonts from '../Theme/Fonts';
import RewardPriceInput from './RewardPriceInput';

mapMyIndia.setRestApiKey('361d7bcd497056cd93e80e26889648ad');

mapMyIndia.setClientId(
  '33OkryzDZsJt5fkvQ6lbbdTMPUot2KLluuUXmxYUqwDOM2SJC7_bJGyEhPJKF9-PPHuZRwncQwnLlmQcg-C56w==',
);

mapMyIndia.setClientSecret(
  'lrFxI-iSEg_ztHzB-hJ0bs8r64abWx0nhh5hALmXulSHyAxdL27ZKHagyyRZbBn06wzpVINoAom_RM0LALtqmD8BzM-6RarX',
);

const initialOrderFormData = {
  from: '',
  destination: '',
  date: new Date(),
  description: '',
  title: '',
  imageUrl: '',
};

const ORCreateOrderForm = () => {
  const [formData, setFormData] = useState(initialOrderFormData);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const user = useSelector(getUserDetails);
  const [autoSearchData, setAutoSearchData] = useState({
    name: '',
    data: [],
  });
  const [dateChosenStatus, setDateChosenStatus] = useState({
    date: false,
    time: false,
  });

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.date;
    setShow(Platform.OS === 'ios');
    setFormData(prev => ({...prev, date: currentDate}));
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
    setDateChosenStatus({...dateChosenStatus, date: true});
  };

  const showTimepicker = () => {
    showMode('time');
    setDateChosenStatus({...dateChosenStatus, time: true});
  };

  const autoSearch = (key, value) => {
    console.log('VALUE', value);
    if (!value || !value.length) {
      setAutoSearchData({
        name: '',
        data: [],
      });
      console.log('INSIDE EMPTY');
    } else {
      mapMyIndia.atlas_auto({query: value, pod: 'STATE'}, response => {
        console.log('AUTO_SEARCH', response);
        setAutoSearchData({
          name: key,
          data: response?.suggestedLocations || [],
        });
      });
      console.log('INSIDE NOT EMPTY');
    }
  };

  const inputChangeHandler = (key, value) => {
    setFormData(prev => ({...prev, [key]: value}));
    if (key === 'from' || key === 'destination') {
      autoSearch(key, value);
    }
  };

  const onSubmit = async () => {
    const {isError, errorMessage} = isValidFormValues(formData);
    if (isError) {
      return Alert.alert(errorMessage);
    }
    addOrder(formData, user).then(() => setFormData(initialOrderFormData));
  };

  const getData = key => {
    if (autoSearchData.name === key) {
      return autoSearchData.data;
    } else {
      return [];
    }
  };

  const onItemClick = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
    setAutoSearchData({
      name: '',
      data: [],
    });
  };

  return (
    <ScrollView style={styles.container}>
      <ImageUploader
        text={'Upload product image'}
        formData={formData}
        inputChangeHandler={inputChangeHandler}
      />

      <AutoSearchInput
        name={'from'}
        value={formData.from}
        onChange={v => inputChangeHandler('from', v)}
        placeholder={'From'}
        data={getData('from')}
        onItemClick={onItemClick}
      />

      <AutoSearchInput
        name={'destination'}
        value={formData.destination}
        onChange={v => inputChangeHandler('destination', v)}
        placeholder={'To'}
        data={getData('destination')}
        onItemClick={onItemClick}
      />

      <Input
        value={formData.title}
        onChange={v => inputChangeHandler('title', v)}
        placeholder={'Title'}
        containerStyle={{marginTop: 0}}
      />
      {/*<View style={{zIndex: 10}}>*/}
      {/*  <Select*/}
      {/*    optionTextStyle={{*/}
      {/*      color: 'black'*/}
      {/*    }}*/}
      {/*    data={MODE_OPTIONS}*/}
      {/*    onSelect={value => inputChangeHandler('modeOfTravel', value)}*/}
      {/*    value={formData.modeOfTravel}*/}
      {/*    config={styles.dropDownConfig}*/}
      {/*    placeholder={'Mode of transport'}*/}
      {/*    textBoxStyle={styles.dropDownTextBox}*/}
      {/*    textBoxTextStyle={{*/}
      {/*      color: 'black',*/}
      {/*    }}*/}
      {/*    dropdownStyle={styles.dropDownStyle}*/}
      {/*    width={'100%'}*/}
      {/*  />*/}
      {/*</View>*/}
      <View style={styles.dateAndTimeContainer}>
        <PseudoInput
          onPress={showDatepicker}
          textColor={dateChosenStatus.date ? 'white' : Color.LightGrey1}
          placeholder={
            !dateChosenStatus.date
              ? 'Date'
              : moment(formData.date).format('DD-MMM-YYYY')
          }
          containerStyle={{flex: 1, marginRight: 6}}
        />
        <PseudoInput
          onPress={showTimepicker}
          textColor={dateChosenStatus.time ? 'white' : Color.LightGrey1}
          placeholder={
            !dateChosenStatus.time
              ? 'Time'
              : moment(formData.date).format('ddd, LT')
          }
          containerStyle={{flex: 1, marginLeft: 6}}
        />
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={formData.date}
          mode={mode}
          style={{color: 'red'}}
          // is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
      {/*<Input*/}
      {/*  value={formData.rewardPrice}*/}
      {/*  placeholder={'Offered price'}*/}
      {/*  onChange={value => inputChangeHandler('rewardPrice', value)}*/}
      {/*/>*/}
      <Input
        value={formData.description}
        placeholder={'Description'}
        onChange={value => inputChangeHandler('description', value)}
        multiline={true}
        numberOfLines={4}
      />
      <Button onPress={onSubmit} text={'Create Order'} />
      <View style={{height: 100}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'black',
  },
  tagLine: {
    fontSize: FontSizes.large,
    color: 'black',
    fontFamily: Fonts.EloquiaDisplayExtraBold,
    lineHeight: 48,
  },
  dateAndTimeContainer: {
    flexDirection: 'row',
  },
  dropDownConfig: {
    fontSize: FontSizes.small,
    color: 'black',
    selectedBackgroundColor: 'white',
    selectedTextColor: Color.LightGrey1,
    selectedFontWeight: 'bold',
    fontFamily: Fonts.FontAwesome,
  },
  dropDownTextBox: {
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Color.LightGrey3,
    marginTop: 16,
    fontFamily: Fonts.FontAwesome,
  },
  dropDownStyle: {
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Color.LightGrey3,
    fontFamily: Fonts.FontAwesome,
  },
});

export default ORCreateOrderForm;
