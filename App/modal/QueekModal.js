import React from 'react';
import {
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

const OrderCreateModal = ({visible, onClose, children}) => {
  return (
    <Modal
      visible={visible}
      presentationStyle={'overFullScreen'}
      style={styles.modal}>
      <View style={styles.container}>
        <TouchableOpacity onPress={onClose} style={styles.cross}>
          <Entypo name={'cross'} size={24} />
        </TouchableOpacity>
        {children}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: '20%',
    paddingHorizontal: 15,
    height: 800,
    justifyContent: 'space-between',
  },
  cross: {
    flexDirection: 'row-reverse',
  },
});

export default OrderCreateModal;
