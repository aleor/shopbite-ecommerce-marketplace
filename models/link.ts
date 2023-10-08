import { Destination } from './destination';
import { LinkType } from './linkType';

export type Link = {
  type: LinkType;
  ordering: number;
  destinations: Destination[];
};
