import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import FontSizes from '../Theme/FontSizes';
import Fonts from '../Theme/Fonts';
import Color from '../Theme/Color';

const API_KEY = 'AIzaSyCal9Z6wV8rHaYEmy1E7zxcKWrdAzbxVkU';

const getUrl = searchKeyword =>
  `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${API_KEY}&input=${searchKeyword}`;

const GooglePlacesInput = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isShowingResults, setIsShowingResults] = useState(false);

  const searchLocation = async text => {
    console.log('Text', text);
    setSearchKeyword(text);
    axios
      .request({
        method: 'post',
        url: getUrl(searchKeyword),
      })
      .then(response => {
        console.log(response.data);
        setSearchResults(response.data.predictions);
        setIsShowingResults(true);
      })
      .catch(e => {
        console.log(e.response);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.autocompleteContainer}>
        <TextInput
          placeholder="From"
          returnKeyType="search"
          style={styles.searchBox}
          placeholderTextColor="#000"
          onChangeText={text => searchLocation(text)}
          value={searchKeyword}
        />
        {isShowingResults && (
          <FlatList
            data={searchResults}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  style={styles.resultItem}
                  onPress={() => {
                    setSearchKeyword(item.description);
                    setIsShowingResults(false);
                  }}>
                  <Text>{item.description}</Text>
                </TouchableOpacity>
              );
            }}
            keyExtractor={item => item.id}
            style={styles.searchResultsContainer}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default GooglePlacesInput;

const styles = StyleSheet.create({
  autocompleteContainer: {
    zIndex: 1,
  },
  searchResultsContainer: {
    width: 340,
    height: 200,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 50,
  },
  resultItem: {
    width: '100%',
    justifyContent: 'center',
    height: 40,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingLeft: 15,
  },
  searchBox: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.FontAwesome,
    color: 'black',
    width: 340,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Color.LightGrey3,
    paddingLeft: 15,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
