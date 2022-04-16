import {addReview, getReviewsByUserIdApi} from '../api/review';
import {updateUserApi} from '../api/users';

const calculateOverallRating = (rating, reviews) => {
  const prevRatings = reviews.map(r => Number(r.rating));
  const totalNoOfReviews = reviews.length + 1;
  // sum of all reviews rating
  const sumOfPrevRating = prevRatings.reduce((result, current) => {
    return result + current;
  }, Number(rating));

  return Math.ceil(sumOfPrevRating / totalNoOfReviews);
};

export const addReviewHandler = async params => {
  const {rating, submittedFor: userId} = params;
  const reviews = await getReviewsByUserIdApi(userId);
  let overallRating = 0;

  // update overall rating
  if (reviews && reviews.length) {
    overallRating = calculateOverallRating(rating, reviews);
  }

  // Update user rating and add review
  await Promise.all([
    addReview(params),
    ...(overallRating ? [updateUserApi(userId, {overallRating})] : []),
  ]);
};
