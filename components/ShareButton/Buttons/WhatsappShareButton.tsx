import createShareButton from '../core/createShareButton';
import objectToGetParams from '../core/objectToGetParams';

function isMobileOrTablet() {
  return /(android|iphone|ipad|mobile)/i.test(navigator.userAgent);
}

function whatsappLink(
  url: string,
  { title, separator }: { title?: string; separator?: string }
) {
  return (
    'https://' +
    (isMobileOrTablet() ? 'api' : 'web') +
    '.whatsapp.com/send' +
    objectToGetParams({
      text: title ? title + separator + url : url,
    })
  );
}

export const WhatsappShareButton = createShareButton<{
  title?: string;
  separator?: string;
}>(
  'whatsapp',
  whatsappLink,
  (props) => ({
    title: props.title,
    separator: props.separator || ' ',
  }),
  {
    windowWidth: 550,
    windowHeight: 400,
  }
);
