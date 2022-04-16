import {db} from '../../App';

export const addNewUser = params =>
  db.collection('users').doc(params.phoneNumber).set(params);

export const getUserByPhone = phone =>
  db
    .collection('users')
    .where('_id', '==', phone)
    .get()
    .then(snapshot =>
      snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })),
    );

export const updateUserApi = (id, updatedField) => {
  return db
    .collection('users')
    .doc(id)
    .set({...updatedField}, {merge: true});
};

export const getUsersByIdsApi = usersId => {
  return db
    .collection('users')
    .where('_id', 'in', usersId)
    .get()
    .then(snapshot =>
      snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })),
    );
};
