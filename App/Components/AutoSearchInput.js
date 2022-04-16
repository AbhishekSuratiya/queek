import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import Color from '../Theme/Color';
import FontSizes from '../Theme/FontSizes';
import Fonts from '../Theme/Fonts';

const AutoSearchInput = ({
  onChange,
  data,
  value,
  name,
  placeholder,
  onItemClick,
}) => {
  return (
    <View
      style={[
        styles.autocompleteContainer,
        {zIndex: name === 'from' ? 10 : 9},
      ]}>
      <Autocomplete
        style={{color: 'white', fontSize: 16, height: 40}}
        data={data}
        value={value}
        placeholder={placeholder}
        onChangeText={text => onChange(text)}
        placeholderTextColor={Color.LightGrey1}
        flatListProps={{
          style: {
            margin: 0,
            backgroundColor: 'black',
          },
          keyExtractor: (_, idx) => idx,
          renderItem: ({item}) => (
            <TouchableOpacity
              style={styles.listItemText}
              onPress={() => onItemClick(name, item.placeAddress)}>
              <Text style={{color: 'white'}}>{item.placeAddress}</Text>
            </TouchableOpacity>
          ),
        }}
        containerStyle={{marginBottom: 16, backgroundColor: 'black'}}
        inputContainerStyle={styles.containerStyle}
        listStyle={{padding: 5, marginBottom: 10}}
        listContainerStyle={{
          width: '100%',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  autocompleteContainer: {
    flex: 1,
  },
  listItemText: {
    padding: 6,
    marginBottom: 5,
    fontSize: FontSizes.small,
    fontFamily: Fonts.FontAwesome,
    color: 'black',
  },
  containerStyle: {
    width: '100%',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Color.LightGrey3,
  },
});

export default AutoSearchInput;
