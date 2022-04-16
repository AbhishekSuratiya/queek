import {db} from '../../App';
const COLLECTION_NAME = 'traveller';

export const addTravelApi = params =>
  db.collection(COLLECTION_NAME).add(params);

export const getTravellersApi = () =>
  db
    .collection(COLLECTION_NAME)
    .get()
    .then(snapshot =>
      snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })),
    );

export const getTravellersByUserApi = id =>
  db
    .collection(COLLECTION_NAME)
    .where('postedBy', '==', id)
    .get()
    .then(snapshot =>
      snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })),
    );

export const getTravellersByUserIdApi = id =>
  db
    .collection(COLLECTION_NAME)
    .where('requestedOrderersId', 'array-contains', id)
    .get()
    .then(snapshot =>
      snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })),
    );

export const getTravellersByIdsApi = ids =>
  db
    .collection(COLLECTION_NAME)
    .where('postedBy', 'in', ids)
    .get()
    .then(snapshot =>
      snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })),
    );

export const updateTravellerApi = (id, updatedField) => {
  return db
    .collection(COLLECTION_NAME)
    .doc(id)
    .set({...updatedField}, {merge: true});
};
