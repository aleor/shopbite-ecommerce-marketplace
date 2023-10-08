import admin from 'firebase-admin';

const config = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

export const getAdminAuth = () => {
  return !admin.apps.length
    ? admin.initializeApp(config).auth()
    : admin.app().auth();
};
