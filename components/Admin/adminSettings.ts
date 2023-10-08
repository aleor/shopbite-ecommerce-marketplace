export const adminSettings = {
  item: {
    maxImages: 10,
    maxImageSize: 2 * 1024 * 1024, // 2MB
    maxTitleLength: 80,
    maxDescriptionLength: 800,
    maxPrice: 99_999_999,
    maxVariants: 10,
    maxVariantTitleLength: 30,
    maxAddons: 10,
    maxAddonTitleLength: 30,
  },
  collection: {
    maxTitleLength: 30,
  },
  links: {
    maxBioLinkLabelLength: 30,
    maxExternalLinkLabelLength: 30,
    maxDifferentLinkTypes: 10,
    maxDestinationsPerLink: 10,
  },
  profile: {
    maxNameLength: 40,
    maxDescriptionLength: 200,
    maxProfileImageSize: 2 * 1024 * 1024, // 2MB
    maxContactCaptionLength: 80,
  },
  freePlanLimits: {
    maxNonHiddenItems: 30,
    maxImages: 1,
  },
  imageCacheSettings: {
    cacheControl: 'public, max-age=604800',
  },
  payments: {
    showExtendPremiumStatusDaysGap: 7,
  },
};
