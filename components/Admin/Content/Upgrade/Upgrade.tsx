import { useRouter } from 'next/router';
import { parseUrl } from 'query-string';
import { useState } from 'react';

import { Box } from '@chakra-ui/react';

import SpinnerOverlay from '../../SpinnerOverlay';
import Benefits from './Benefits';
import FreePackage from './FreePackage';
import PlanSelector from './PlanSelector';

export type UpgradeTabMode =
  | 'view_all_benefits'
  | 'view_free_package'
  | 'select_plan';

const Upgrade = () => {
  const router = useRouter();
  const query = parseUrl(router.asPath)?.query;
  const paymentResult = query?.payment as 'success' | 'failure';

  const [upgradeTabMode, setUpgradeTabMode] =
    useState<UpgradeTabMode>('view_all_benefits');

  return (
    <>
      <SpinnerOverlay visible={false} message="Applying changes..." />
      <Box px="4" py="4" width="100%" pointerEvents={false ? 'none' : 'all'}>
        {upgradeTabMode === 'view_all_benefits' && (
          <Benefits
            paymentResult={paymentResult}
            onShowPackage={() => setUpgradeTabMode('view_free_package')}
            onSelectPlan={() => setUpgradeTabMode('select_plan')}
          />
        )}
        {upgradeTabMode === 'view_free_package' && (
          <FreePackage onClose={() => setUpgradeTabMode('view_all_benefits')} />
        )}
        {upgradeTabMode === 'select_plan' && (
          <PlanSelector
            onClose={() => setUpgradeTabMode('view_all_benefits')}
          />
        )}
      </Box>
    </>
  );
};

export default Upgrade;
