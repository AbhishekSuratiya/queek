import React, {useCallback, useState} from 'react';
import Input from '../Components/Input';
import {useFocusEffect} from '@react-navigation/native';
import {
  ScrollView,
  StyleSheet,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import FontSizes from '../Theme/FontSizes';
import Fonts from '../Theme/Fonts';
import Color from '../Theme/Color';
import Button from '../Components/Button';
import ImageUploader from '../Components/ImageUploader';
import {updateUserApi} from '../api/users';
import {useSelector} from 'react-redux';
import {getUserDetails} from '../redux/selectors/user';

const removeEmptyFields = data => {
  let formData = {};
  for (let key of Object.keys(data)) {
    if (data[key].length > 0) {
      formData[key] = data[key];
    }
  }
  return formData;
};

const initialData = {
  name: '',
  age: '',
  address: '',
  imageUrl: '',
};

function UserProfileScreen() {
  const [formData, setFormData] = useState(initialData);
  const storedUser = useSelector(getUserDetails);
  const [loading, setLoading] = useState(false);

  const inputChangeHandler = (key, value) => {
    setFormData(prev => ({...prev, [key]: value}));
  };

  const resetData = () => {
    setFormData(initialData);
  };

  const handleSubmit = async () => {
    if (Object.values(formData).every(d => !d.length)) {
      return Alert.alert('Please select at least one field');
    }
    setLoading(true);
    const formDataWithoutEmptyFields = removeEmptyFields(formData);
    try {
      const result = await updateUserApi(
        storedUser._id,
        formDataWithoutEmptyFields,
      );
      setLoading(false);
      Alert.alert('User Updated Successfully');
      resetData();
    } catch (error) {
      console.log(error);
      setLoading(false);
      Alert.alert(error.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      resetData();
    }, []),
  );

  return (
    <ScrollView style={styles.container}>
      <ImageUploader
        formData={formData}
        text={'Upload profile image'}
        inputChangeHandler={inputChangeHandler}
      />
      <Input
        value={formData.name}
        placeholder={'Name'}
        onChange={value => inputChangeHandler('name', value)}
      />
      <Input
        value={formData.age}
        placeholder={'Age'}
        onChange={value => inputChangeHandler('age', value)}
      />
      <Input
        value={formData.address}
        placeholder={'Address'}
        onChange={value => inputChangeHandler('address', value)}
      />

      <Button onPress={handleSubmit} text={'Submit'}/>
      <View style={{height: 100}}/>
      {loading ? <ActivityIndicator size={'large'}/> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'black'
  },
});
export default UserProfileScreen;
