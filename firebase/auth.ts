import { getAuth } from 'firebase/auth';

import firebaseApp from './clientApp';

export const auth = getAuth(firebaseApp);
