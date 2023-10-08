import { useEffect, useState } from 'react';

import {
    AspectRatio, Box, Circle, HStack, IconButton, Image, Skeleton, Stack, StackProps
} from '@chakra-ui/react';

import { CloseButtonIcon } from '../../../Icons/CloseButtonIcon';
import { Carousel, CarouselSlide, useCarousel } from './Carousel';

interface SliderProps {
  images: string[];
  aspectRatio?: number;
  rootProps?: StackProps;
  onClose: () => void;
}

export const Slider = (props: SliderProps) => {
  const { aspectRatio = 1 / 1, rootProps } = props;
  const images = props.images || ['/images/no_photo.png'];

  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, instanceRef] = useCarousel({
    slideChanged: (slider) => setCurrentSlide(slider.track.details.rel),
    created: (slider) => slider.update(),
  });

  return (
    <Box paddingBottom="4" position="relative" {...rootProps}>
      <Carousel ref={sliderRef}>
        {images?.map((image, i) => (
          <CarouselSlide key={i}>
            <AspectRatio
              ratio={aspectRatio}
              transition="all 200ms"
              opacity={currentSlide === i ? 1 : 0.4}
              _hover={{ opacity: 1 }}
            >
              <Image
                src={image}
                objectFit="cover"
                alt={image}
                fallback={<Skeleton borderBottomRadius="28px" />}
                borderBottomRadius="28px"
              />
            </AspectRatio>
          </CarouselSlide>
        ))}
      </Carousel>
      <Box position="absolute" top="0" py="4" paddingLeft="2">
        <IconButton
          icon={<CloseButtonIcon />}
          variant="ghost"
          color="brand.gray"
          aria-label="Close"
          onClick={props.onClose}
          _focus={{ outline: 'none' }}
          _active={{ background: 'none' }}
          _hover={{ background: 'none' }}
        />
      </Box>
      {images?.length > 1 && (
        <HStack
          position="absolute"
          width="full"
          justify="center"
          bottom="0"
          py="8"
        >
          {images?.map((_, index) => (
            <Circle
              key={index}
              size={currentSlide === index ? '3' : '2'}
              bg={currentSlide === index ? 'white' : 'whiteAlpha.600'}
            />
          ))}
        </HStack>
      )}
    </Box>
  );
};
