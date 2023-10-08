import { useEffect, useState } from 'react';

import {
  Box,
  Button,
  HStack,
  IconButton,
  IconButtonProps,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react';

import { logShareEvent } from '../../libs/analytics/logEvents';
import { ShareIcon } from '../Icons/ShareIcon';
import { renderButton, shareButtons } from './shareButtons';

const ShareButton = ({
  link,
  title,
  iconButtonProps,
}: {
  link?: string;
  title?: string;
  iconButtonProps?: IconButtonProps;
}) => {
  const [url, setUrl] = useState(link || '');

  useEffect(() => {
    if (!url && typeof window !== undefined) {
      setUrl(window.location.href);
    }
  }, [link]);

  return (
    <Popover>
      <PopoverTrigger>
        <IconButton
          aria-label="Share"
          icon={<ShareIcon />}
          variant="link"
          _focus={{ outline: 'none' }}
          justifyContent="center"
          size="xl"
          {...iconButtonProps}
        ></IconButton>
      </PopoverTrigger>

      <PopoverContent
        borderRadius="20px"
        _focus={{ outline: 'none' }}
        width="auto"
        rootProps={{ zIndex: '1000' }}
      >
        <PopoverArrow />
        <PopoverCloseButton mt="1" />
        <PopoverHeader fontWeight="semibold" border="none" pl="6">
          Bagikan melalui
        </PopoverHeader>

        <PopoverBody
          px={{ base: '6', sm: '4', md: '10' }}
          py={{ base: '4', sm: '4', md: '3' }}
          maxWidth="max-content"
        >
          <VStack spacing={0}>
            <SimpleGrid
              columns={{ sm: 2, md: 4 }}
              spacingX={{ base: 10, sm: 10, md: 10 }}
              spacingY={{ base: 6, sm: 6, md: 6 }}
            >
              {shareButtons.map((button) => {
                return (
                  <Box
                    key={button.label}
                    maxWidth="60px"
                    onClick={() => {
                      logShareEvent({ url, method: button.label });
                    }}
                  >
                    {renderButton({ ...button, url, title })}
                  </Box>
                );
              })}
            </SimpleGrid>
            <HStack
              pt="6"
              pb={{ base: '4', sm: '2', md: '4' }}
              spacing={0}
              width="100%"
            >
              <Input
                borderLeftRadius="8px"
                fontFamily="source"
                fontSize="14px"
                color="brand.blue"
                textDecoration="underline"
                spellCheck="false"
                autoCorrect="off"
                _focus={{ outline: 'none' }}
                size="sm"
                borderRight="none"
                defaultValue={url}
              />

              <Button
                borderLeftRadius={0}
                variant="solid"
                color="white"
                bg="brand.green"
                fontFamily="poppins"
                fontSize="14px"
                fontWeight="normal"
                size="sm"
                _hover={{ bg: 'brand.green.hover' }}
                _focus={{ outline: 'none' }}
                onClick={() => {
                  navigator.clipboard.writeText(url);
                }}
              >
                Salin
              </Button>
            </HStack>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default ShareButton;
