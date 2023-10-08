import { BetaAnalyticsDataClient } from '@google-analytics/data';

export const propertyId = process.env.GA_PROPERTY_ID;

export const gaClient = new BetaAnalyticsDataClient({
  propertyId,
  credentials: {
    private_key: process.env.GA_PRIVATE_KEY,
    client_email: process.env.GA_CLIENT_EMAIL,
  },
});
