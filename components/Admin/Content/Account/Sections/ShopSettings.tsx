import { doc, updateDoc } from 'firebase/firestore';
import { useCallback, useContext, useEffect, useState } from 'react';
import { HiOutlinePencil } from 'react-icons/hi';

import {
    Button, FormControl, FormLabel, HStack, IconButton, Input, InputGroup, InputLeftAddon,
    InputRightAddon, Radio, RadioGroup, Text, VStack
} from '@chakra-ui/react';

import { db } from '../../../../../firebase/firestore';
import { useToast } from '../../../../../libs/useToast';
import { AdminContactType, shopConverter } from '../../../../../models';
import CharCounter from '../../../../CharCounter';
import InfoButtonWithTooltip from '../../../../InfoButtonWithTooltip';
import { adminSettings } from '../../../adminSettings';
import { ShopContext } from '../../../hooks/shopContext';
import SectionHeader from './SectionHeader';

const ShopSettings = () => {
  const shop = useContext(ShopContext);
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [contactCaption, setContactCaption] = useState(
    shop?.contactCaption || ''
  );
  const [contactType, setContactType] = useState<AdminContactType>(
    shop?.adminDestination || AdminContactType.WA
  );
  const [contactNumber, setContactNumber] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    if (!shop) {
      return;
    }

    if (shop.adminDestination === AdminContactType.WA) {
      const number = shop.adminContactId?.startsWith('+62')
        ? shop.adminContactId.slice(3)
        : shop.adminContactId;

      setContactNumber(number);
    }

    if (shop.adminDestination === AdminContactType.MAIL) {
      setContactEmail(shop.adminContactId);
    }
  }, [shop]);

  const renderAdminContact = useCallback(() => {
    if (!shop) {
      return null;
    }

    const destination =
      shop.adminDestination === AdminContactType.WA ? 'WhatsApp' : 'Email';

    return `${destination} ${shop.adminContactId}`;
  }, [shop]);

  const onSave = async () => {
    if (
      (contactType === AdminContactType.WA && !contactNumber?.length) ||
      (contactType === AdminContactType.MAIL && !contactEmail?.length)
    ) {
      showToast({
        title: 'Shop admin contact required',
        description:
          'Please fill in the shop admin contact so that your customers can contact you',
        status: 'error',
      });
      return;
    }

    setIsSaving(true);

    try {
      const docRef = doc(db, 'shops', shop.id).withConverter(shopConverter);

      await updateDoc(docRef, {
        adminDestination: contactType,
        adminContactId:
          contactType === AdminContactType.WA
            ? `+62${contactNumber}`
            : contactEmail,
        contactCaption,
      });

      showToast({
        title: 'Shop settings saved successfully',
        description: 'Changes saved successfully',
        status: 'success',
      });

      setIsSaving(false);
      setMode('view');
    } catch (error) {
      setIsSaving(false);
      showToast({
        title: 'Failed to save shop settings',
        description: 'An error occurred during save, please try again',
        status: 'error',
      });
    }
  };

  const renderViewMode = useCallback(() => {
    return (
      <>
        <FormControl width={{ base: '50%', sm: '100%', md: '50%' }}>
          <FormLabel
            htmlFor="shopAdmin"
            fontFamily="poppins"
            fontWeight="semibold"
            fontSize={{ base: '16px', sm: '14px', md: '16px' }}
          >
            Shop Admin Contact<sup>*</sup>
          </FormLabel>

          <Text
            fontFamily="source"
            fontSize={{ base: '16px', sm: '14px', md: '16px' }}
            fontWeight="normal"
          >
            {renderAdminContact()}
          </Text>
        </FormControl>

        <FormControl width={{ base: '50%', sm: '100%', md: '50%' }}>
          <FormLabel
            htmlFor="contactCaption"
            fontFamily="poppins"
            fontWeight="semibold"
            fontSize={{ base: '16px', sm: '14px', md: '16px' }}
          >
            Contact Caption
          </FormLabel>

          <Text
            fontFamily="source"
            fontSize={{ base: '16px', sm: '14px', md: '16px' }}
            fontWeight="normal"
          >
            {shop?.contactCaption || '-'}
          </Text>
        </FormControl>
      </>
    );
  }, [shop]);

  const renderEditMode = () => {
    return (
      <>
        <FormControl width={{ base: '50%', sm: '100%', md: '50%' }}>
          <FormLabel
            htmlFor="shopAdmin"
            fontFamily="poppins"
            fontWeight="semibold"
            fontSize={{ base: '16px', sm: '14px', md: '16px' }}
          >
            Shop Admin Contact<sup>*</sup>
          </FormLabel>

          <RadioGroup defaultValue={contactType} name="contactType" pt="2">
            <HStack spacing="8">
              <Radio
                value={AdminContactType.WA}
                fontWeight="normal"
                fontFamily="source"
                onChange={(e) =>
                  setContactType(e.target.value as AdminContactType)
                }
              >
                WhatsApp
              </Radio>

              <Radio
                value={AdminContactType.MAIL}
                fontWeight="normal"
                fontFamily="source"
                onChange={(e) =>
                  setContactType(e.target.value as AdminContactType)
                }
              >
                Mail
              </Radio>
            </HStack>
          </RadioGroup>
        </FormControl>

        <FormControl width={{ base: '50%', sm: '100%', md: '50%' }}>
          <FormLabel
            htmlFor="contactId"
            fontFamily="poppins"
            fontWeight="semibold"
            fontSize={{ base: '16px', sm: '14px', md: '16px' }}
          >
            <HStack>
              <Text>
                {contactType === AdminContactType.WA
                  ? 'Whatsapp Phone Number'
                  : 'Email'}
              </Text>
              <InfoButtonWithTooltip label="Your customers will be redirected to your shop admin after checkout" />
            </HStack>
          </FormLabel>

          {contactType === AdminContactType.WA ? (
            <InputGroup size="md">
              <InputLeftAddon children="+62" />
              <Input
                id="contactId"
                size="md"
                value={contactNumber}
                onChange={(e) => {
                  setContactNumber(e.target.value);
                }}
                noOfLines={1}
                placeholder="812-3456-7890"
                lineHeight="14px"
                resize="none"
                _focus={{ outline: 'none' }}
                _hover={{ borderColor: 'inherit' }}
                spellCheck={false}
                autoComplete="off"
                type="tel"
              />
            </InputGroup>
          ) : (
            <Input
              id="contactId"
              size="md"
              value={contactEmail}
              onChange={(e) => {
                setContactEmail(e.target.value);
              }}
              noOfLines={1}
              placeholder="e.g. contoh@gmail.com"
              lineHeight="14px"
              resize="none"
              _focus={{ outline: 'none' }}
              _hover={{ borderColor: 'inherit' }}
              spellCheck={false}
              autoComplete="off"
              type="email"
            />
          )}
        </FormControl>

        <FormControl width={{ base: '50%', sm: '100%', md: '50%' }}>
          <FormLabel
            htmlFor="contactCaption"
            fontFamily="poppins"
            fontWeight="semibold"
            fontSize={{ base: '16px', sm: '14px', md: '16px' }}
          >
            <HStack>
              <Text>Default Purchase Message from Customer</Text>
              <Text
                fontFamily="source"
                fontWeight="normal"
                color="brand.black40"
                fontSize="14px"
              >
                (Optional)
              </Text>
              <InfoButtonWithTooltip label="This is the message your customers will be sending when making a purchase" />
            </HStack>
          </FormLabel>

          <InputGroup size="md">
            <Input
              id="contactCaption"
              size="md"
              value={contactCaption}
              onChange={(e) => {
                setContactCaption(e.target.value);
              }}
              maxLength={adminSettings.profile.maxContactCaptionLength}
              noOfLines={1}
              borderRight="none"
              placeholder="e.g. Hello, I would like to order this item, is it available?"
              lineHeight="14px"
              resize="none"
              _focus={{ outline: 'none' }}
              _hover={{ borderColor: 'inherit' }}
              spellCheck={false}
              autoComplete="off"
              isInvalid={false}
            />
            <InputRightAddon
              borderRightRadius="8px"
              backgroundColor="white"
              borderLeft="none"
              children={
                <CharCounter
                  value={contactCaption}
                  maxLength={adminSettings.profile.maxContactCaptionLength}
                />
              }
            />
          </InputGroup>
        </FormControl>
      </>
    );
  };

  return (
    <VStack spacing="6" alignItems="flex-start" w="100%">
      <SectionHeader title="Pengaturan Toko">
        {mode === 'view' ? (
          <IconButton
            icon={<HiOutlinePencil size="20px" />}
            onClick={() => {
              setMode('edit');
            }}
            aria-label="Change Shop Settings"
            variant="ghost"
            color="brand.green"
            _focus={{ outline: 'none' }}
            size="sm"
          />
        ) : (
          <>
            <Button
              fontFamily="poppins"
              minWidth="200px"
              size="sm"
              onClick={onSave}
              display={{ base: 'flex', sm: 'none', md: 'flex' }}
              isDisabled={isSaving}
              isLoading={isSaving}
              loadingText="Saving..."
            >
              Save Changes
            </Button>

            <Button
              fontFamily="poppins"
              fontSize="12px"
              variant="outline"
              borderColor="brand.green"
              color="brand.green"
              borderRadius="20px"
              px="8px"
              size="sm"
              height="1.5"
              isDisabled={isSaving}
              isLoading={isSaving}
              loadingText="Saving..."
              _focus={{ outline: 'none' }}
              onClick={onSave}
              display={{ base: 'none', sm: 'flex', md: 'none' }}
            >
              Save Changes
            </Button>
          </>
        )}
      </SectionHeader>
      {mode === 'view' ? renderViewMode() : renderEditMode()}
    </VStack>
  );
};

export default ShopSettings;
