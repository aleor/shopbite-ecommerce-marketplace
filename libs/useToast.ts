import { UseToastOptions } from '@chakra-ui/react';
import { useToast as useChakraToast } from '@chakra-ui/toast';

export const useToast = () => {
  const toast = useChakraToast();

  const showToast = ({
    duration = 5000,
    title,
    description,
    variant,
    status,
  }: UseToastOptions) => {
    toast({
      duration,
      status,
      isClosable: true,
      position: 'top-right',
      variant: variant || 'subtle',
      title,
      description,
    });
  };

  return { showToast };
};
