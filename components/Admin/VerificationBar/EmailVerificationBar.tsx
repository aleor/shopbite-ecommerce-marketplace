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
        To publish your store, you will need to verify
        your registered email. We have sent a verification email to
        your email address.
      </Text>
      {emailSent ? (
        <Text>The verification email has been sent</Text>
      ) : (
        <Text>
          <Link
            color="brand.green"
            onClick={() => {
              sendEmailVerification();
              setEmailSent(true);
            }}
          >
            Click to send verification email
          </Link>{' '}
          or
        </Text>
      )}
      <Link color="brand.green" onClick={checkEmailStatus}>
        Click to refresh your verification status
      </Link>
    </VerificationBar>
  );
};

export default EmailVerificationBar;
