/*
 default database schema for user, post and review
*/

import {KYC_STATUS} from '../index';

export const userSchema = initializeData => ({
  _id: initializeData?.phoneNumber,
  name: initializeData?.name,
  imageUrl: initializeData?.imageUrl || '',
  kycStatus: initializeData?.kycStatus || KYC_STATUS.PENDING,
  kycRequestId: initializeData?.kycRequestId || '',
  phoneNumber: initializeData?.phoneNumber,
  address: initializeData?.address || '',
  overallRating: 0,
});

export const travellerSchema = initializeData => ({
  from: initializeData.from,
  destination: initializeData.destination,
  postedBy: initializeData.postedBy,
  travelDate: initializeData.travelDate,
  postedDate: initializeData.postedDate,
  modeOfTravel: initializeData.modeOfTravel,
  rewardPrice: initializeData.rewardPrice,
  requestedOrderersId: [],
  rejectedOrderersId: [],
  isPicked: false,
  isCompleted: false,
  pickedBy: '',
});

export const orderSchema = initializeData => ({
  from: initializeData.from,
  productName: initializeData.productName,
  productImageUrl: initializeData.productImageUrl,
  destination: initializeData.destination,
  postedBy: initializeData.postedBy,
  beforeDate: initializeData.beforeDate,
  postedDate: initializeData.postedDate,
  isCompleted: false,
  isPicked: false,
  pickedBy: '',
  requestedTravellersId: [],
  rejectedTravellersId: [],
});

export const reviewSchema = initializeData => ({
  description: initializeData.description,
  rating: initializeData.rating,
  submittedFor: initializeData.submittedFor,
  submittedBy: initializeData.submittedBy,
});
