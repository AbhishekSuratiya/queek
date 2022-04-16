import {createReducer} from '@reduxjs/toolkit';
import {clearUserDetails, setUserDetails} from '../actions/user';

const initialState = null;

const userReducer = createReducer(initialState, builder => {
  builder.addCase(setUserDetails, (state, action) => action.payload);
  builder.addCase(clearUserDetails, () => initialState);
});

export default userReducer;
