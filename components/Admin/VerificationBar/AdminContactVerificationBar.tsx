import { Link, Text } from '@chakra-ui/react';

import { useNavigation } from '../hooks/useNavigation';
import VerificationBar from './VerificationBar';

const AdminContactVerificationBar = () => {
  const { navigateTo } = useNavigation();

  return (
    <VerificationBar>
      <Text color="brand.error">
        Untuk mempublikasikan toko Anda, Anda harus memasukkan kontak admin toko Anda agar pelanggan Anda dapat menghubungi Anda.
      </Text>

      <Link color="brand.green" onClick={() => navigateTo('account')}>
        Klik disini untuk atur kontak admin toko
      </Link>
    </VerificationBar>
  );
};

export default AdminContactVerificationBar;
