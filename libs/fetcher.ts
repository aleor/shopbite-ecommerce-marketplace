import { getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

import firebaseApp from '../firebase/clientApp';

export default async function fetcher(url: string, data = undefined) {
  const token = await getAuth(firebaseApp).currentUser?.getIdToken();

  const res = await fetch(`${window.location.origin}/api${url}`, {
    method: data ? 'POST' : 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Auth: `${token}`,
    },
    body: JSON.stringify(data),
  });
  if (res.status > 399 || res.status < 200) {
    throw new Error(res.statusText);
  }
  return await res.json();
}
