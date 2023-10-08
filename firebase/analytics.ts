import { getAnalytics } from 'firebase/analytics';

import firebaseApp from './clientApp';

export const analytics =
  typeof window !== 'undefined' ? getAnalytics(firebaseApp) : null;
