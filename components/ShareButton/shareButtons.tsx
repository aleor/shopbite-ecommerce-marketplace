import { EmailIcon } from '@chakra-ui/icons';
import { Icon, Text, VStack } from '@chakra-ui/react';

import { FacebookIcon, TwitterIcon, WhatsappIcon } from '../Icons/Social';
import {
    EmailShareButton, FacebookShareButton, TwitterShareButton, WhatsappShareButton
} from './Buttons';

const iconProps = { color: 'brand.green', width: '40px', height: '40px' };

export const shareButtons: {
  getButton: (url: string, title?: string) => JSX.Element;
  label: string;
}[] = [
  {
    getButton: (url: string, title?: string) => (
      <WhatsappShareButton url={url} title={title}>
        <Icon aria-label="Share on Whatsapp" {...iconProps}>
          <WhatsappIcon />
        </Icon>
      </WhatsappShareButton>
    ),
    label: 'Whatsapp',
  },
  {
    getButton: (url: string, title?: string) => (
      <FacebookShareButton url={url} title={title}>
        <Icon aria-label="Share on Facebook" {...iconProps}>
          <FacebookIcon />
        </Icon>
      </FacebookShareButton>
    ),
    label: 'Facebook',
  },
  {
    getButton: (url: string, title?: string) => (
      <TwitterShareButton url={url} title={title}>
        <Icon aria-label="Share on Twitter" {...iconProps}>
          <TwitterIcon />
        </Icon>
      </TwitterShareButton>
    ),
    label: 'Twitter',
  },
  {
    getButton: (url: string, title?: string) => (
      <EmailShareButton url={url} title={title}>
        <Icon aria-label="Share via Email" {...iconProps}>
          <EmailIcon />
        </Icon>
      </EmailShareButton>
    ),
    label: 'Email',
  },
];

export const renderButton = ({
  getButton,
  label,
  url,
  title,
}: {
  getButton: (url: string, title?: string) => JSX.Element;
  label: string;
  url: string;
  title?: string;
}) => {
  return (
    <VStack spacing="1">
      {getButton(url, title)}
      <Text fontSize="12px" fontWeight="normal" fontFamily="source">
        {label}
      </Text>
    </VStack>
  );
};
