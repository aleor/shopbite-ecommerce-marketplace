import { HTMLChakraProps, Icon } from '@chakra-ui/react';

export const CopyLinkIcon = (props: HTMLChakraProps<'svg'>) => (
  <Icon
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="20" cy="20" r="20" fill="#3E8989" />
    <path
      d="M10.6665 16.5V28.1667C10.6665 29.4554 11.7112 30.5 12.9998 30.5H22.3332M15.3332 14.1667V23.5C15.3332 24.7887 16.3778 25.8333 17.6665 25.8333H24.6665H26.9998C28.2885 25.8333 29.3332 24.7887 29.3332 23.5V15.8166C29.3332 15.5072 29.2102 15.2104 28.9915 14.9916L23.8416 9.84171C23.6228 9.62292 23.326 9.5 23.0166 9.5H17.6665C16.3778 9.5 15.3332 10.5447 15.3332 11.8333V14.1667Z"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);
