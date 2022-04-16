import React, {useState} from 'react';
import {Alert, Platform, ScrollView, StyleSheet, View} from 'react-native';
import PseudoInput from './PseudoInput';
import Color from '../Theme/Color';
import moment from 'moment';
import Button from './Button';
import DateTimePicker from '@react-native-community/datetimepicker';
import FontSizes from '../Theme/FontSizes';
import Fonts from '../Theme/Fonts';
import AutoSearchInput from './AutoSearchInput';
import mapMyIndia from 'mapmyindia-restapi-react-native-beta/index';
import {isValidFormValues} from '../utils';
import {useSelector} from 'react-redux';
import {getUserDetails} from '../redux/selectors/user';
import {addTravel} from '../handlers/travel';
import Select, {SelectItem} from '@redmin_delishaj/react-native-select/index';
import RewardPriceInput from './RewardPriceInput';
import Input from './Input';

const initialOrderFormData = {
  from: '',
  destination: '',
  modeOfTravel: '',
  rewardPrice: '',
  date: new Date(),
};

const MODE_OPTIONS: SelectItem[] = [
  {text: 'Train', value: 'train'},
  {text: 'Car', value: 'car'},
  {text: 'Plane', value: 'plane'},
];

const TRAddTravelDetailsForm = () => {
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
    setFormData(prev => ({...prev, date: currentDate}));
    setShow(Platform.OS === 'ios');
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
        console.log(response);
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

  const onSubmit = () => {
    const {isError, errorMessage} = isValidFormValues(formData);
    if (isError) {
      return Alert.alert(errorMessage);
    }
    addTravel(formData, user).then(() => {
      setFormData(initialOrderFormData);
    });
  };

  return (
    <ScrollView style={styles.container}>
      <AutoSearchInput
        name={'from'}
        value={formData.from}
        onChange={v => inputChangeHandler('from', v)}
        placeholder={'Travelling from'}
        data={getData('from')}
        onItemClick={onItemClick}
      />

      <AutoSearchInput
        name={'destination'}
        value={formData.destination}
        onChange={v => inputChangeHandler('destination', v)}
        placeholder={'Travelling to'}
        data={getData('destination')}
        onItemClick={onItemClick}
      />
      <View style={{zIndex: 5}}>
        <Select
          optionTextStyle={{
            color: 'white',
          }}
          data={MODE_OPTIONS}
          onSelect={value => inputChangeHandler('modeOfTravel', value)}
          value={formData.modeOfTravel}
          config={styles.dropDownConfig}
          placeholder={'Mode of transport'}
          textBoxStyle={styles.dropDownTextBox}
          textBoxTextStyle={{
            color: 'white',
          }}
          dropdownStyle={styles.dropDownStyle}
          width={'100%'}
        />
      </View>
      <RewardPriceInput
        formData={formData}
        inputChangeHandler={inputChangeHandler}
      />
      {/*<Input*/}
      {/*  value={formData.rewardPrice}*/}
      {/*  placeholder={'Offered price'}*/}
      {/*  onChange={value => inputChangeHandler('rewardPrice', value)}*/}
      {/*/>*/}
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
          testID="dateTimePicker2"
          value={formData.date}
          mode={mode}
          // is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
      <Button onPress={onSubmit} text={'Add trip'} />
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
    fontSize: FontSizes.large - 4,
    color: 'black',
    fontFamily: Fonts.EloquiaDisplayExtraBold,
    lineHeight: 40,
  },
  dateAndTimeContainer: {
    flexDirection: 'row',
  },
  dropDownConfig: {
    fontSize: FontSizes.small,
    selectedBackgroundColor: 'black',
    selectedTextColor: 'white',
    selectedFontWeight: 'bold',
    fontFamily: Fonts.FontAwesome,
    textColor: 'white',
    placeholderTextColor: 'white',
  },
  dropDownTextBox: {
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Color.LightGrey3,
    marginTop: 16,
    fontFamily: Fonts.FontAwesome,
    backgroundColor: 'black',
  },
  dropDownStyle: {
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Color.LightGrey3,
    fontFamily: Fonts.FontAwesome,
    backgroundColor: 'black',
  },
});

export default TRAddTravelDetailsForm;
