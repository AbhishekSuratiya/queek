import {db} from '../../App';
const COLLECTION_NAME = 'reviews';

export const addReview = params => db.collection('reviews').doc().set(params);

export const getReviewsByUserIdApi = id =>
  db
    .collection(COLLECTION_NAME)
    .where('submittedFor', '==', id)
    .get()
    .then(snapshot =>
      snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })),
    );
