import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/source-sans-pro/400.css';
import '@fontsource/source-sans-pro/600.css';
import '../theme/styles.scss';
import '../theme/date-picker.css';

import { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';
import smoothscroll from 'smoothscroll-polyfill';

import { ChakraProvider } from '@chakra-ui/react';

import { store } from '../app/store';
import shopbiteTheme from '../theme';

function App({ Component, pageProps }: AppProps) {
  if (typeof window !== 'undefined') {
    smoothscroll.polyfill();
  }

  return (
    <>
      <Head>
        <title>Shopbite</title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, viewport-fit=cover"
        />
      </Head>
      <ChakraProvider resetCSS theme={shopbiteTheme}>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </ChakraProvider>
    </>
  );
}

export default App;
