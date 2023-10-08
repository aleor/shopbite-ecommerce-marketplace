import { IconButton } from '@chakra-ui/react';

import { DuplicateIcon } from './Icons/DuplicateIcon';

const CopyLinkButton = ({
  link,
  size = 'sm',
}: {
  link: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}) => {
  return (
    <IconButton
      icon={<DuplicateIcon width="18px" height="18px" />}
      color="brand.green"
      onClick={() => {
        navigator.clipboard.writeText(link);
      }}
      aria-label={'Salin link pesanan'}
      variant="ghost"
      size={size}
      _focus={{ outline: 'none' }}
    />
  );
};

export default CopyLinkButton;
