import { doc, getDoc } from 'firebase/firestore';
import pDebounce from 'p-debounce';

import { db } from '../firebase/firestore';

const checkUsername = async (
  username: string | undefined
): Promise<string | undefined> => {
  // length between 3 and 30 symbols
  if (!username || username.length < 3 || username.length > 30)
    return 'Username must between 3 and 30 characters';

  // only letters, numbers, underscores and dots
  let regex = /^[a-z0-9._]+$/;
  if (!regex.test(username))
    return 'Username may only contain letters, numbers, underscores ("_") and periods (".")';

  // can't start or end with dot
  regex = /^(?!\.).*[^\.]$/;
  if (!regex.test(username))
    return 'Username cannot start or end with a period (".")';

  // can't have two dots in a row
  regex = /^\w+(?:\.\w+)*$/;
  if (!regex.test(username))
    return 'Username cannot contain more than one period (".") in a row';

  // username must be unique
  const docRef = doc(db, 'usernames', username);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) return 'Username is already taken';

  return undefined;
};

const debouncedUsernameCheck = pDebounce(checkUsername, 500);

export const validators = {
  email: (value: string) => {
    if (!value) {
      return 'Email is required';
    }

    return !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
      ? 'Please enter a valid email address'
      : undefined;
  },
  password: (value: string) =>
    value?.length < 6 ? 'Password must be at least 6 characters' : undefined,
  username: async (value: string) => await debouncedUsernameCheck(value),
};
