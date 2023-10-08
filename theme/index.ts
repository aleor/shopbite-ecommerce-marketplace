import { extendTheme } from '@chakra-ui/react';

import { Alert } from './components/alert';
import { Button } from './components/button';
import { Input } from './components/input';
import { Link } from './components/link';
import { Modal } from './components/modal';
import { Text } from './components/text';
import { breakpoints } from './foundations/breakpoints';
import { colors } from './foundations/colors';
import { fonts } from './foundations/fonts';
import { fontSizes } from './foundations/sizes';

const shopbiteTheme = extendTheme({
  colors,
  fonts,
  fontSizes,
  breakpoints,
  components: {
    Link,
    Button,
    Input,
    Text,
    Modal,
    Alert,
  },
});

export default shopbiteTheme;
