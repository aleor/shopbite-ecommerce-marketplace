import { addDoc, collection, getFirestore, Timestamp } from 'firebase/firestore';

import firebaseApp from '../../../firebase/clientApp';

export default async function handler(req, res) {
  try {
    const { name, email, message } = JSON.parse(req.body);

    const db = getFirestore(firebaseApp);

    await addDoc(collection(db, 'contacts'), {
      name,
      email,
      message,
      createdAt: Timestamp.fromDate(new Date()),
    });
  } catch (error) {
    res.status(400).send(error);
    return;
  }

  res.json();
}
