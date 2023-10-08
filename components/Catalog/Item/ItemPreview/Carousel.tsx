import { KeenSliderOptions, useKeenSlider } from 'keen-slider/react';
import React, { forwardRef } from 'react';

import { Box, BoxProps, Flex, FlexProps, IconButton, IconButtonProps } from '@chakra-ui/react';

export const Carousel = forwardRef<HTMLDivElement, FlexProps>(function Carousel(
  props,
  ref
) {
  return (
    <Flex
      ref={ref}
      className="shopbite-carousel"
      overflow="hidden"
      position="relative"
      userSelect="none"
      {...props}
    />
  );
});

export const CarouselSlide = (props: BoxProps) => (
  <Box
    className="shopbite-carousel__slide"
    position="relative"
    overflow="hidden"
    minWidth="100vw"
    maxWidth="100vw"
    {...props}
  />
);

export const CarouselIconButton = (props: IconButtonProps) => (
  <IconButton
    variant="unstyled"
    boxSize="auto"
    minW="auto"
    display="inline-flex"
    fontSize="2xl"
    color="gray.600"
    _hover={{
      color: 'blue.500',
      _disabled: { color: 'gray.600' },
    }}
    _active={{ color: 'blue.600' }}
    _focus={{ boxShadow: 'none' }}
    _focusVisible={{ boxShadow: 'outline' }}
    {...props}
  />
);

export const useCarousel = (options?: KeenSliderOptions) => {
  const defaultOptions = { selector: '.shopbite-carousel__slide' };
  return useKeenSlider<HTMLDivElement>({
    ...defaultOptions,
    ...options,
  });
};
