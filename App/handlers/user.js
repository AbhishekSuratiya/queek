import {Alert} from 'react-native';
import {addNewUser, getUserByPhone, updateUserApi} from '../api/users';
import {userSchema} from '../constants/schema';
import axios from "axios";
import {encodeBASE64, fetchDigioBaseUrl, fetchInitiateKycUrl} from "../utils";
import {DIGIO_CONSTANTS} from "../constants";

export const createNewUser = async user => {
  try {
    const data = await getUserByPhone(user.phoneNumber);
    console.log('DATA', data);
    if (data.length) {
      return;
    }
    await addNewUser(userSchema(user));
  } catch (error) {
    console.error(error);
    Alert.alert(error.message);
  }
};

export const checkAndUpdateKYCStatus = async(userId, requestId)=>{
    const {CLIENT_ID: clientId, CLIENT_SECRET: clientSecret} = DIGIO_CONSTANTS[process.env.NODE_ENV];
  try{
    const instance = axios.create({
      baseURL: fetchDigioBaseUrl,
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Basic ${encodeBASE64(`${clientId}:${clientSecret}`)}`
        },
        data: {
          id: requestId
        }
    });

    const {data} = await instance.post(`${requestId}/response`);

    await updateUserApi(userId, {
      kycStatus: data.status
    });
    return data.status
  }
  catch(err){
    console.log(err);
    return;
  }
}