import React, {useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import {getUserDetails} from '../redux/selectors/user';
import {Alert, StyleSheet, SafeAreaView} from 'react-native';
import DigioWebview from '../Components/DigioWebview';

const KycAlertContext = React.createContext();
const {Provider} = KycAlertContext;

const KycAlertProvider = ({children}) => {
  const [open, setOpen] = useState();
  const user = useSelector(getUserDetails);

  const isKycDone = useMemo(() => {
    return true;
    // return user.kycStatus === 'approval';
    //TODO: Remove true with above comment statement
  }, [user]);

  const openAlert = () =>
    Alert.alert('KYC Alert', 'Please do your KYC first', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Proceed KYC', onPress: () => setOpen(true)},
    ]);

  return (
    <>
      {open ? (
        <SafeAreaView style={styles.webviewContainer}>
          <DigioWebview closeWV={() => setOpen(false)} />
        </SafeAreaView>
      ) : null}
      <Provider value={{isKycDone, openAlert}}>{children}</Provider>
    </>
  );
};

export function useKycAlertContext() {
  const context = React.useContext(KycAlertContext);
  if (!context) {
    throw new Error(
      `Alert compound components cannot be rendered outside the Toggle component`,
    );
  }
  return context;
}

const styles = StyleSheet.create({
  webviewContainer: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
  },
});

export default KycAlertProvider;
