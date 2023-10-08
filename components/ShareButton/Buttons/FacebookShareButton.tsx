import createShareButton from '../core/createShareButton';
import objectToGetParams from '../core/objectToGetParams';

function facebookLink(
  url: string,
  { quote, hashtag }: { quote?: string; hashtag?: string }
) {
  return (
    'https://www.facebook.com/sharer/sharer.php' +
    objectToGetParams({
      u: url,
      quote,
      hashtag,
    })
  );
}

export const FacebookShareButton = createShareButton<{
  quote?: string;
  hashtag?: string;
}>(
  'facebook',
  facebookLink,
  (props) => ({
    quote: props.quote,
    hashtag: props.hashtag,
  }),
  {
    windowWidth: 550,
    windowHeight: 400,
  }
);
