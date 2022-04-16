import {db} from '../../App';

const COLLECTION_NAME = 'orders';

export const addOrderApi = params =>
  db.collection(COLLECTION_NAME).doc().set(params);

export const getOrderApi = () =>
  db
    .collection(COLLECTION_NAME)
    .get()
    .then(snapshot =>
      snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })),
    );

export const getOrdersByIdApi = id =>
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

export const getOrdersByUserIdApi = id =>
  db
    .collection(COLLECTION_NAME)
    .where('requestedTravellersId', 'array-contains', id)
    .get()
    .then(snapshot =>
      snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })),
    );

export const updateOrderApi = (id, updatedField) => {
  return db
    .collection(COLLECTION_NAME)
    .doc(id)
    .set({...updatedField}, {merge: true});
};
