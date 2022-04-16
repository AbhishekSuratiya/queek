import React, {useState} from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import storage from '@react-native-firebase/storage';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Entypo';
import Color from '../Theme/Color';

const ImageUploader = ({formData, inputChangeHandler, text}) => {
  const [isLoading, setIsLoading] = useState(false);

  const getFileName = (name, path) => {
    if (name != null) {
      return name;
    }

    if (Platform.OS === 'ios') {
      path = '~' + path.substring(path.indexOf('/Documents'));
    }
    return path.split('/').pop();
  };

  const getPlatformPath = ({uri}) => {
    return Platform.select({
      android: uri,
      ios: uri,
    });
  };

  const chooseFile = () => {
    launchImageLibrary().then(response => {
      console.log('Response', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const primaryImage = response?.assets?.[0] || {};
        let path = getPlatformPath(primaryImage);
        let fileName = getFileName(primaryImage.fileName, path);
        uploadImageToStorage(path, fileName);
      }
    });
  };

  const downloadImageUrl = ref => {
    ref
      .getDownloadURL()
      .then(url => {
        inputChangeHandler('imageUrl', url);
        setIsLoading(false);
      })
      .catch(e => {
        setIsLoading(false);
        console.log('Errors while downloading => ', e);
      });
  };

  const uploadImageToStorage = (path, name) => {
    setIsLoading(true);
    let reference = storage().ref(name);
    let task = reference.putFile(path);
    task
      .then(() => {
        console.log('Image uploaded to the bucket!');
        downloadImageUrl(reference);
      })
      .catch(e => {
        console.log('uploading image error => ', e);
        setIsLoading(false);
        Alert.alert('Uploading error, try again');
      });
  };

  const deleteFileFromStorage = url => {
    const desertRef = storage().refFromURL(url);
    desertRef
      .delete()
      .then(function () {
        inputChangeHandler('imageUrl', '');
        console.log('File Deleted');
      })
      .catch(function (error) {
        console.error(error);
        console.log('Error on Deleting');
        Alert.alert('Error on Deleting, try again');
      });
  };

  return (
    <View style={styles.container}>
      {isLoading ? <ActivityIndicator size={'large'} /> : null}
      <View style={styles.imgContainer}>
        {formData.imageUrl ? (
          <>
            <Image
              style={styles.uploadImage}
              source={{uri: formData.imageUrl}}
            />
            <Pressable
              style={styles.cross}
              onPress={() => deleteFileFromStorage(formData.imageUrl)}>
              <Icon name={'cross'} size={32} color={'white'} />
            </Pressable>
          </>
        ) : null}
        <TouchableOpacity
          style={styles.eightyWidthStyle}
          onPress={formData.imageUrl ? null : chooseFile}>
          <Text style={{color: 'white'}}>{text}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ImageUploader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  imgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  cross: {
    position: 'absolute',
    top: 0,
    right: 20,
  },
  eightyWidthStyle: {
    margin: 2,
    padding: 10,
    paddingHorizontal: 36,
    borderRadius: 6,
    backgroundColor: Color.ThemePurple,
  },
  uploadImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 8,
  },
  loadingIndicator: {
    zIndex: 5,
    width: '100%',
    height: '100%',
  },
  boldTextStyle: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#5EB0E5',
  },
});
