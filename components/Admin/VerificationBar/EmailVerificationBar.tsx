import { useState } from 'react';

import { Link, Text } from '@chakra-ui/react';

import VerificationBar from './VerificationBar';

const EmailVerificationBar = ({
  sendEmailVerification,
  checkEmailStatus,
}: {
  sendEmailVerification: () => void;
  checkEmailStatus: () => void;
}) => {
  const [emailSent, setEmailSent] = useState(false);

  return (
    <VerificationBar>
      <Text color="brand.error">
        Untuk mempublikasikan toko Anda, Anda harus melakukan verifikasi ke
        email terdaftar Anda. Kami telah mengirimkan email verifikasi ke alamat
        email Anda.
      </Text>
      {emailSent ? (
        <Text>Email verifikasi telah dikirimkan kembali!</Text>
      ) : (
        <Text>
          <Link
            color="brand.green"
            onClick={() => {
              sendEmailVerification();
              setEmailSent(true);
            }}
          >
            Klik untuk meminta ulang email verifikasi
          </Link>{' '}
          or
        </Text>
      )}
      <Link color="brand.green" onClick={checkEmailStatus}>
        Klik untuk refresh status verifikasi Anda
      </Link>
    </VerificationBar>
  );
};

export default EmailVerificationBar;
