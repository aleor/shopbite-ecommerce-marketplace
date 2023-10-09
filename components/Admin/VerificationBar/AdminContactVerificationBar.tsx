import { Link, Text } from '@chakra-ui/react';

import { useNavigation } from '../hooks/useNavigation';
import VerificationBar from './VerificationBar';

const AdminContactVerificationBar = () => {
  const { navigateTo } = useNavigation();

  return (
    <VerificationBar>
      <Text color="brand.error">
        To publish your store, you must provide your shop admin contact so your customers can contact you.
      </Text>

      <Link color="brand.green" onClick={() => navigateTo('account')}>
        Click here to set shop admin contact
      </Link>
    </VerificationBar>
  );
};

export default AdminContactVerificationBar;
