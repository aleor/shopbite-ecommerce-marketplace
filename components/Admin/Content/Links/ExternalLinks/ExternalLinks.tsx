import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { Box, Button, Heading, HStack, Text, VStack } from '@chakra-ui/react';

import { db } from '../../../../../firebase/firestore';
import { useToast } from '../../../../../libs/useToast';
import { Destination, Link, shopConverter } from '../../../../../models';
import { adminSettings } from '../../../adminSettings';
import { linkUrlIsAllowed } from '../validateExternalUrl';
import ExternalLink from './ExternalLink';
import NewExternalLink from './NewExternalLink';

type ExternalLinksPageMode = 'view' | 'add';

const ExternalLinks = ({
  shopId,
  links,
  onSaveStart,
  onSaveEnd,
}: {
  shopId: string;
  links: Link[];
  onSaveStart: () => void;
  onSaveEnd: () => void;
}) => {
  const [externalLinksPageMode, setExternalLinksPageMode] =
    useState<ExternalLinksPageMode>('view');
  const [externalLinks, setExternalLinks] = useState<Link[]>(links || []);
  const [newExternalLink, setNewExternalLink] = useState<Link>();
  const [isLinkValid, setIsLinkValid] = useState(false);

  const getNextLinkOrdering = () => {
    return links?.sort((a, b) => b.ordering - a.ordering)[0]?.ordering + 1 || 0;
  };

  const [nextLinkOrdering, setNextLinkOrdering] = useState(
    getNextLinkOrdering()
  );

  const [linkTypesLimitExceeded, setLinkTypesLimitExceeded] = useState(false);
  const [
    destinationsPerLinkLimitExceeded,
    setDestinationsPerLinkLimitExceeded,
  ] = useState(false);

  const fetchLinks = async () => {
    const docRef = doc(db, 'shops', shopId).withConverter(shopConverter);

    const document = await getDoc(docRef);

    if (document.exists()) {
      const shop = document.data();
      setExternalLinks(shop.links || []);
    }
  };

  useEffect(() => {
    setNextLinkOrdering(getNextLinkOrdering());
  }, [externalLinks]);

  useEffect(() => {
    if (!newExternalLink?.type) {
      setIsLinkValid(false);
      setLinkTypesLimitExceeded(false);
      setDestinationsPerLinkLimitExceeded(false);
      return;
    }

    const linksLimitExceeded = () => {
      const existingLinkTypes = externalLinks.map((link) => link.type);

      const linkTypesLimitExceeded =
        !existingLinkTypes.includes(newExternalLink.type) &&
        existingLinkTypes.length >= adminSettings.links.maxDifferentLinkTypes;

      return linkTypesLimitExceeded;
    };

    const destinationsPerLinkLimitExceeded = () => {
      const targetLink = externalLinks.find(
        (link) => link.type === newExternalLink.type
      );

      const destinationsPerLinkLimitExceeded = targetLink
        ? targetLink.destinations.length >=
          adminSettings.links.maxDestinationsPerLink
        : false;

      return destinationsPerLinkLimitExceeded;
    };

    const isLinksLimitExceeded = linksLimitExceeded();
    const isDestinationsPerLinkLimitExceeded =
      destinationsPerLinkLimitExceeded();

    const linkValid =
      linkUrlIsAllowed(newExternalLink.destinations[0]?.url) &&
      !isLinksLimitExceeded &&
      !isDestinationsPerLinkLimitExceeded;

    setLinkTypesLimitExceeded(isLinksLimitExceeded);
    setDestinationsPerLinkLimitExceeded(isDestinationsPerLinkLimitExceeded);
    setIsLinkValid(linkValid);
  }, [newExternalLink, externalLinks]);

  const { showToast } = useToast();

  const save = async (links: Link[]) => {
    const docRef = doc(db, 'shops', shopId).withConverter(shopConverter);

    await updateDoc(docRef, {
      links: links,
    });
  };

  const saveNewLink = async () => {
    if (!newExternalLink) return;

    const existingLink = externalLinks.find(
      (link) => link.type === newExternalLink.type
    );

    const updatedLinks = existingLink
      ? [
          ...externalLinks.map((link) =>
            link === existingLink
              ? {
                  ...link,
                  destinations: link.destinations.concat(
                    newExternalLink.destinations
                  ),
                }
              : link
          ),
        ]
      : [...externalLinks, newExternalLink];

    onSaveStart();

    try {
      await save(updatedLinks);
      await fetchLinks();

      onSaveEnd();
      setExternalLinksPageMode('view');
    } catch (error) {
      onSaveEnd();
      showToast({
        title: 'Gagal menyimpan link',
        description: 'Harap mencoba kembali',
        status: 'error',
      });
      console.error(error);
    }
  };

  const writeUpdatedLink = async ({
    originalLink,
    updatedLink,
  }: {
    originalLink: Link;
    updatedLink: Link;
  }) => {
    const docRef = doc(db, 'shops', shopId).withConverter(shopConverter);

    await updateDoc(docRef, {
      links: arrayRemove(originalLink),
    });

    if (updatedLink.destinations.length > 0) {
      await updateDoc(docRef, {
        links: arrayUnion(updatedLink),
      });
    }
  };

  const onSaveDestination = async (newDestination: Destination) => {
    const sourceLink = externalLinks.find((link) =>
      link.destinations.find(
        (destination) => destination.id === newDestination.id
      )
    );

    if (!sourceLink) return;

    const originalDestination = sourceLink.destinations.find(
      (destination) => destination.id === newDestination.id
    );

    if (
      originalDestination.label === newDestination.label &&
      originalDestination.url === newDestination.url
    ) {
      return;
    }

    onSaveStart();

    try {
      const updatedSourceLink = {
        ...sourceLink,
        destinations: [
          ...sourceLink.destinations.map((d) =>
            d.id === newDestination.id ? newDestination : d
          ),
        ],
      };

      await writeUpdatedLink({
        originalLink: sourceLink,
        updatedLink: updatedSourceLink,
      });
      await fetchLinks();

      onSaveEnd();
    } catch (error) {
      onSaveEnd();
      showToast({
        title: 'Gagal mengubah data link',
        description: 'Harap mencoba kembali',
        status: 'error',
      });
      console.error(error);
    }
  };

  const onDeleteDestination = async (destinationId: string) => {
    const sourceLink = externalLinks.find((link) =>
      link.destinations.find((destination) => destination.id === destinationId)
    );

    if (!sourceLink) return;

    onSaveStart();

    try {
      const updatedLinkDestinations = sourceLink.destinations.filter(
        (destination) => destination.id !== destinationId
      );

      const updatedSourceLink = {
        ...sourceLink,
        destinations: updatedLinkDestinations,
      };

      await writeUpdatedLink({
        originalLink: sourceLink,
        updatedLink: updatedSourceLink,
      });

      await fetchLinks();

      onSaveEnd();
    } catch (error) {
      onSaveEnd();
      showToast({
        title: 'Gagal menghapus link',
        description: 'Harap mencoba kembali',
        status: 'error',
      });
      console.error(error);
    }
  };

  const onLinkActionButtonClicked = async () => {
    if (externalLinksPageMode === 'view') {
      setExternalLinksPageMode('add');
      return;
    }

    if (externalLinksPageMode === 'add') {
      await saveNewLink();
      setExternalLinksPageMode('view');
      return;
    }
  };

  return (
    <VStack
      spacing="8"
      alignItems="flex-start"
      pb="8"
      pt="2"
      px={{ base: 0, sm: 2, md: 0 }}
    >
      <HStack
        width="100%"
        justifyContent={{
          base: 'space-around',
          sm: 'space-between',
          lg: 'left',
        }}
        spacing={{ base: 8, sm: 2, md: 8 }}
      >
        <HStack
          spacing={{ base: 4, sm: 2, lg: 4 }}
          width="100%"
          justifyContent={{
            base: 'space-around',
            sm: 'space-between',
            lg: 'left',
          }}
        >
          <HStack spacing={{ base: 6, sm: 3, md: 6 }}>
            <Heading
              as="h4"
              fontFamily="poppins"
              fontWeight="semibold"
              fontSize={{ base: '24px', sm: '16px', md: '24px' }}
            >
              Link External
            </Heading>
          </HStack>
        </HStack>
        <HStack spacing={{ base: 8, sm: 4, md: 8 }}>
          {externalLinksPageMode === 'add' && (
            <Button
              fontFamily="poppins"
              size="md"
              _focus={{ outline: 'none' }}
              onClick={() => {
                setExternalLinksPageMode('view');
              }}
              variant="ghost"
              color={{
                base: 'brand.red',
              }}
            >
              Batalkan
            </Button>
          )}

          <Button
            fontFamily="poppins"
            minWidth="200px"
            size="md"
            onClick={onLinkActionButtonClicked}
            isDisabled={externalLinksPageMode === 'add' && !isLinkValid}
            _focus={{ outline: 'none' }}
            display={{ base: 'flex', sm: 'none', md: 'flex' }}
          >
            {externalLinksPageMode === 'view'
              ? 'Tambah link baru'
              : 'Simpan link baru'}
          </Button>

          <Button
            variant="link"
            color="brand.green"
            _focus={{ outline: 'none' }}
            aria-label="Add new link"
            minHeight="32px"
            display={{ base: 'none', sm: 'flex', md: 'none' }}
            onClick={onLinkActionButtonClicked}
            isDisabled={externalLinksPageMode === 'add' && !isLinkValid}
          >
            {externalLinksPageMode === 'view' ? 'Tambah link baru' : 'Simpan'}
          </Button>
        </HStack>
      </HStack>

      {externalLinksPageMode === 'view' && externalLinks.length === 0 && (
        <Text fontFamily="source" fontWeight="normal" fontSize="14px">
          Kamu belum memiliki link external.
        </Text>
      )}

      {externalLinksPageMode === 'add' && (
        <NewExternalLink
          destinationsPerLinkExceeded={destinationsPerLinkLimitExceeded}
          linkTypesExceeded={linkTypesLimitExceeded}
          onChange={(link) => setNewExternalLink(link)}
          nextLinkOrder={nextLinkOrdering}
        />
      )}

      {externalLinks
        .sort((a, b) => a.ordering - b.ordering)
        .map((link) => (
          <Box key={link.type} width="100%">
            <ExternalLink
              link={link}
              onSaveDestination={onSaveDestination}
              onDeleteDestination={onDeleteDestination}
            />
          </Box>
        ))}
    </VStack>
  );
};

export default ExternalLinks;
