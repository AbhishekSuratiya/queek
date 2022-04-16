import React, {useEffect} from 'react';
import Input from './Input';
import {calculatePriceByDistance, toRupees} from '../utils';
import _ from 'lodash';
const PRICE_CALC_DELAY = 2000;

const RewardPriceInput = ({formData, inputChangeHandler}) => {
  useEffect(() => {
    const {from, destination, modeOfTravel} = formData;
    if (from.length && destination.length && modeOfTravel.length) {
      // Add 2 seconds delay
      _.debounce(() => {
        const price = calculatePriceByDistance(from, destination, modeOfTravel);
        inputChangeHandler('rewardPrice', toRupees(price));
      }, PRICE_CALC_DELAY)();
    }
  }, [formData.from, formData.destination, formData.modeOfTravel]);

  return (
    <>
      <Input
        value={formData.rewardPrice}
        placeholder={'Offered price'}
        editable={false}
      />
    </>
  );
};

export default RewardPriceInput;
