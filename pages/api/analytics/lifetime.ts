import { getAdminAuth } from '../../../firebase/adminAuth';
import {
    getCatalogVisits, getItemsViewed, getOrdersCreated, getPurchaseRevenue
} from '../../../libs/api/reports';

const endDate = 'today';

let startDate: string;

export default async function handler(req, res) {
  const idToken = req.headers.auth;

  if (!idToken) {
    res.status(401).send('Unauthorized');
    return;
  }

  let shopId: string;

  try {
    const decodedIdToken = await getAdminAuth().verifyIdToken(idToken);
    shopId = decodedIdToken.uid;
  } catch (error) {
    res.status(401).send('Unauthorized');
    return;
  }

  startDate = req.query?.startDate;

  if (!startDate) {
    res.status(400).end();
    return;
  }

  const [
    catalogVisitsReport,
    itemsViewedReport,
    ordersCreatedReport,
    purchaseRevenueReport,
  ] = await Promise.all([
    getCatalogVisits(shopId, startDate, endDate),
    getItemsViewed(shopId, startDate, endDate),
    getOrdersCreated(shopId, startDate, endDate),
    getPurchaseRevenue(shopId, startDate, endDate),
  ]);

  res.json({
    shopAnalyticsReport: {
      catalogVisitsReport,
      itemsViewedReport,
      ordersCreatedReport,
      purchaseRevenueReport,
    },
  });
}
