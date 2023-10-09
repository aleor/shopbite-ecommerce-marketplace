import { Link, Text } from '@chakra-ui/react';

import { useNavigation } from '../hooks/useNavigation';
import VerificationBar from './VerificationBar';

const PremiumEndDateVerificationBar = () => {
  const { navigateTo } = useNavigation();

  return (
    <VerificationBar>
      <Text color="brand.error">
        Oops... Your Premium Account status is about to expire and potentially become a Standard Account.
      </Text>

      <Link color="brand.green" onClick={() => navigateTo('upgrade')}>
        Click here to extend your Premium Account
      </Link>
    </VerificationBar>
  );
};

export default PremiumEndDateVerificationBar;
