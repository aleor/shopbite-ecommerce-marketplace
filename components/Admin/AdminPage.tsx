import { differenceInDays } from 'date-fns';
import { getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useMemo, useState } from 'react';
import { useAuthState, useSendEmailVerification } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

import { Box, Center, Flex, HStack, Spinner, Text, useBreakpointValue } from '@chakra-ui/react';

import { db } from '../../firebase/firestore';
import { functionsRegion } from '../../firebase/functions';
import { Shop, shopConverter } from '../../models';
import { adminSettings } from './adminSettings';
import Content from './Content/Content';
import AdminHeader from './Header/AdminHeader';
import { ShopContext } from './hooks/shopContext';
import NavSidebar from './Navigation/NavSidebar/NavSidebar';
import AdminContactVerificationBar from './VerificationBar/AdminContactVerificationBar';
import EmailVerificationBar from './VerificationBar/EmailVerificationBar';
import PremiumEndDateVerificationBar from './VerificationBar/PremiumEndDateVerificationBar';

const auth = getAuth();

const AdminPage = () => {
  const [user] = useAuthState(auth);

  const [shop, loading, error] = useDocumentData<Shop>(
    user && doc(db, 'shops', user?.uid).withConverter(shopConverter)
  );

  const [sendEmailVerification] = useSendEmailVerification(auth);
  const [emailVerified, setEmailVerified] = useState(
    user?.emailVerified ?? false
  );

  const isMobile = useBreakpointValue({ base: true, lg: false });

  if (!user) {
    return null;
  }

  const onVerificationSend = async () => {
    await sendEmailVerification();
  };

  const onRefreshEmailStatus = async () => {
    await user.reload();
    setEmailVerified(user.emailVerified);

    if (user.emailVerified) {
      const syncEmailVerificationStatus = httpsCallable<
        { userId: string },
        { emailVerified: boolean }
      >(getFunctions(getApp(), functionsRegion), 'syncEmailVerificationStatus');

      await syncEmailVerificationStatus({ userId: user.uid });
    }
  };

  if (loading) {
    return (
      <Center pt="10">
        <HStack spacing="4">
          <Spinner color="brand.blue"></Spinner>
          <Text>Loading shop data...</Text>
        </HStack>
      </Center>
    );
  }

  if ((!shop && !loading) || error) {
    return (
      <Center pt="10">
        <Text>
          An error occurred in the attempt to retrieve shop information{' '}
          {error ? `(${error})` : null}
        </Text>
      </Center>
    );
  }

  const renderVerificationBar = () => {
    if (!user.emailVerified) {
      return (
        <EmailVerificationBar
          sendEmailVerification={onVerificationSend}
          checkEmailStatus={onRefreshEmailStatus}
        />
      );
    }

    if (!shop.adminDestination || !shop.adminContactId) {
      return <AdminContactVerificationBar />;
    }

    if (shop.subscriptionEndDate) {
      const daysLeft = differenceInDays(shop.subscriptionEndDate, new Date());
  
      if (daysLeft <= adminSettings.payments.showExtendPremiumStatusDaysGap)
      return <PremiumEndDateVerificationBar />;
    }
  
    return null;
  };

  return (
    <ShopContext.Provider value={shop}>
      <AdminHeader />
      <Flex width="100%" overflowX="hidden">
        {!isMobile ? (
          <Box
            minWidth={{ base: '300px', md: '230px', lg: '300px' }}
            bg="brand.backgroundColor"
            height="auto"
            minHeight="100vh"
          >
            <NavSidebar />
          </Box>
        ) : null}

        <Box w="100%" overflowX="hidden">
          {renderVerificationBar()}

          <Box>
            <Content />
          </Box>
        </Box>
      </Flex>
    </ShopContext.Provider>
  );
};

export default AdminPage;
