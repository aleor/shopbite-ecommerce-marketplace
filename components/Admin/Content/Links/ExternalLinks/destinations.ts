import { LinkType } from '../../../../../models/linkType';
import {
    AnylinkIcon, FacebookIcon, GoFoodIcon, GrabFoodIcon, InstagramIcon, LazadaIcon, LineIcon,
    ShopeeFoodIcon, ShopeeIcon, TelegramIcon, TiktokIcon, TokopediaIcon, TravelokaEatsIcon,
    TwitterIcon, WhatsappIcon, YoutubeIcon
} from '../../../../Icons/Social';

export const destinations = [
  {
    groupName: 'Custom Links',
    destinations: [{ label: 'Any', value: LinkType.Any, icon: AnylinkIcon }],
  },
  {
    groupName: 'Communication Platform',
    destinations: [
      { label: 'WhatsApp', value: LinkType.Whatsapp, icon: WhatsappIcon },
      { label: 'Telegram', value: LinkType.Telegram, icon: TelegramIcon },
      { label: 'Line', value: LinkType.Line, icon: LineIcon },
    ],
  },
  {
    groupName: 'E-Commerce',
    destinations: [
      { label: 'Tokopedia', value: LinkType.Tokopedia, icon: TokopediaIcon },
      { label: 'Lazada', value: LinkType.Lazada, icon: LazadaIcon },
      { label: 'Shopee', value: LinkType.Shopee, icon: ShopeeIcon },
    ],
  },
  {
    groupName: 'Food Delivery',
    destinations: [
      { label: 'GoFood', value: LinkType.GoFood, icon: GoFoodIcon },
      {
        label: 'Traveloka Eats',
        value: LinkType.TravelokaEats,
        icon: TravelokaEatsIcon,
      },
      { label: 'GrabFood', value: LinkType.GrabFood, icon: GrabFoodIcon },
      {
        label: 'Shopee Food',
        value: LinkType.ShopeeFood,
        icon: ShopeeFoodIcon,
      },
    ],
  },
  {
    groupName: 'Social Media',
    destinations: [
      { label: 'Instagram', value: LinkType.Instagram, icon: InstagramIcon },
      { label: 'Facebook', value: LinkType.Facebook, icon: FacebookIcon },
      { label: 'Tiktok', value: LinkType.TikTok, icon: TiktokIcon },
      { label: 'Twitter', value: LinkType.Twitter, icon: TwitterIcon },
      { label: 'YouTube', value: LinkType.Youtube, icon: YoutubeIcon },
    ],
  },
];
