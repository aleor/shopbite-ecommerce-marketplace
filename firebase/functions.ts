import { getFunctions } from 'firebase/functions';

import firebaseApp from './clientApp';

export const functionsRegion = 'europe-west3';

export const getAppFunctions = () => getFunctions(firebaseApp, functionsRegion);
