import { useState } from 'react';
import { HiOutlinePencil } from 'react-icons/hi';

import { Button, Input, InputGroup, InputRightAddon, Text } from '@chakra-ui/react';

import CharCounter from '../../../CharCounter';

const ItemNote = ({
  note = '',
  onChange,
  expanded: initiallyExpanded = false,
}: {
  note: string;
  onChange: (e: string) => void;
  expanded: boolean;
}) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);

  if (!expanded) {
    return (
      <Button
        rightIcon={<HiOutlinePencil />}
        variant="ghost"
        onClick={() => setExpanded(true)}
        color="brand.green"
        paddingLeft="3px"
      >
        <Text color="brand.green">Tambah catatan</Text>
      </Button>
    );
  }

  return (
    <InputGroup size="sm">
      <Input
        borderRadius="8px"
        maxLength={60}
        value={note}
        onChange={(e) => onChange(e.target.value)}
        borderRight="none"
        _focus={{ outline: 'none' }}
        _hover={{ borderColor: 'inherit' }}
        placeholder="Tulis catatan..."
        fontSize="12px"
      />
      <InputRightAddon
        borderRightRadius="8px"
        backgroundColor="white"
        borderLeft="none"
        children={<CharCounter value={note} />}
      />
    </InputGroup>
  );
};

export default ItemNote;
