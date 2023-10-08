import {
    AnylinkIcon, FacebookIcon, GoFoodIcon, GrabFoodIcon, InstagramIcon, LazadaIcon, LineIcon,
    ShopeeFoodIcon, ShopeeIcon, TelegramIcon, TiktokIcon, TokopediaIcon, TravelokaEatsIcon,
    TwitterIcon, WhatsappIcon, YoutubeIcon
} from '../components/Icons/Social';
import { LinkType } from '../models/linkType';

export const getLinkIcon = ({
  type,
  size,
}: {
  type: LinkType;
  size?: { w: string; h: string };
}) => {
  const props = size || { w: '28px', h: '28px' };

  switch (type) {
    case LinkType.Instagram:
      return <InstagramIcon {...props} />;
    case LinkType.Whatsapp:
      return <WhatsappIcon {...props} />;
    case LinkType.TikTok:
      return <TiktokIcon {...props} />;
    case LinkType.Twitter:
      return <TwitterIcon {...props} />;
    case LinkType.Youtube:
      return <YoutubeIcon {...props} />;
    case LinkType.Facebook:
      return <FacebookIcon {...props} />;
    case LinkType.Line:
      return <LineIcon {...props} />;
    case LinkType.Telegram:
      return <TelegramIcon {...props} />;
    case LinkType.Tokopedia:
      return <TokopediaIcon {...props} />;
    case LinkType.Shopee:
      return <ShopeeIcon {...props} />;
    case LinkType.Lazada:
      return <LazadaIcon {...props} />;
    case LinkType.GoFood:
      return <GoFoodIcon {...props} />;
    case LinkType.GrabFood:
      return <GrabFoodIcon {...props} />;
    case LinkType.TravelokaEats:
      return <TravelokaEatsIcon {...props} />;
    case LinkType.ShopeeFood:
      return <ShopeeFoodIcon {...props} />;

    default:
      return <AnylinkIcon {...props} />;
  }
};
