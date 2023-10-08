import { ComponentStyleConfig } from '@chakra-ui/react';

export const Modal: ComponentStyleConfig = {
  baseStyle: {
    dialogContainer: {
      '@supports(height: -webkit-fill-available)': {},
    },
  },
};
