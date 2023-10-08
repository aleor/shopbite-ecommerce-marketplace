import { getFunctions } from 'firebase/functions';

import firebaseApp from './clientApp';

export const functionsRegion = 'asia-southeast2';

export const getAppFunctions = () => getFunctions(firebaseApp, functionsRegion);
