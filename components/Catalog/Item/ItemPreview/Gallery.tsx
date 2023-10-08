import React, { useState } from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

import {
    AspectRatio, HStack, Image, Skeleton, Spacer, Stack, StackProps, useBreakpointValue
} from '@chakra-ui/react';

import { Carousel, CarouselIconButton, CarouselSlide, useCarousel } from './Carousel';

interface GalleryProps {
  images: string[];
  aspectRatio?: number;
  rootProps?: StackProps;
}

const Gallery = (props: GalleryProps) => {
  const { images, aspectRatio = 1 / 1, rootProps } = props;
  const [index, setIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesPerView = useBreakpointValue({ base: 3, md: 3 });

  const [ref, slider] = useCarousel({
    slides: {
      perView: slidesPerView,
      spacing: useBreakpointValue({ base: 16, md: 24 }),
    },
    slideChanged: (slider) => setCurrentSlide(slider.track.details.rel),
  });

  return (
    <Stack spacing="4" {...rootProps} maxWidth="320px">
      <AspectRatio ratio={aspectRatio} width="320px" height="320px">
        <Image
          src={images?.[index] || '/images/no_photo.png'}
          objectFit="cover"
          alt={images?.[index]}
          fallback={<Skeleton />}
        />
      </AspectRatio>
      <HStack
        spacing="4"
        visibility={images?.length > 1 ? 'visible' : 'hidden'}
      >
        <CarouselIconButton
          onClick={() => slider.current?.prev()}
          icon={<HiOutlineChevronLeft />}
          aria-label="Previous slide"
          disabled={currentSlide === 0}
        />
        <Carousel ref={ref} direction="row" width="full">
          {images?.map((image, i) => (
            <CarouselSlide key={i} onClick={() => setIndex(i)} cursor="pointer">
              <AspectRatio
                ratio={aspectRatio}
                transition="all 200ms"
                opacity={index === i ? 1 : 0.4}
                _hover={{ opacity: 1 }}
              >
                <Image
                  src={image}
                  objectFit="cover"
                  alt={image}
                  fallback={<Skeleton />}
                />
              </AspectRatio>
            </CarouselSlide>
          ))}
        </Carousel>
        <CarouselIconButton
          onClick={() => slider.current?.next()}
          icon={<HiOutlineChevronRight />}
          aria-label="Next slide"
          disabled={currentSlide + Number(slidesPerView) === images?.length}
        />
      </HStack>
    </Stack>
  );
};

export default Gallery;
