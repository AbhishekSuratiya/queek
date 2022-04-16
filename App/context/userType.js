import React, {useMemo} from 'react';
export const UserType = {
  orderer: 1,
  travellerer: 2,
};

const UserTypeContext = React.createContext();
const {Provider} = UserTypeContext;

const UserTypeProvider = ({children}) => {
  const [userType, setUserType] = React.useState(UserType.orderer);

  const isOrderer = useMemo(() => {
    return userType === UserType.orderer;
  }, [userType]);

  return <Provider value={{isOrderer, setUserType}}>{children}</Provider>;
};

export {UserTypeProvider, UserTypeContext};
