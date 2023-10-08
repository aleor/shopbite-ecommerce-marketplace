import { Link, Text } from '@chakra-ui/react';

import { useNavigation } from '../hooks/useNavigation';
import VerificationBar from './VerificationBar';

const PremiumEndDateVerificationBar = () => {
  const { navigateTo } = useNavigation();

  return (
    <VerificationBar>
      <Text color="brand.error">
        Oops.. Status Akun Premium Kamu sudah hampir habis dan berpotensi menjadi Akun Standar.
      </Text>

      <Link color="brand.green" onClick={() => navigateTo('upgrade')}>
        Klik disini untuk memperpanjang Akun Premium Kamu
      </Link>
    </VerificationBar>
  );
};

export default PremiumEndDateVerificationBar;
