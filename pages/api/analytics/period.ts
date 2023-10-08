import { getAdminAuth } from '../../../firebase/adminAuth';
import {
    getCatalogVisits, getCollectionsViewed, getDeviceCategories, getItemsViewed, getOrdersCreated,
    getPurchaseRevenue, getSearchedTerms
} from '../../../libs/api/reports';
import { getMostAddedItems } from '../../../libs/api/reports/getMostAddedItems';

let startDate: string;
let endDate: string;

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

  startDate = req.query?.startDate || '7daysAgo';
  endDate = req.query?.endDate || 'today';

  const [
    searchReport,
    deviceCategoryReport,
    topCollectionsReport,
    itemsAnalyticsReport,
  ] = await Promise.all([
    getSearchedTerms(shopId, startDate, endDate),
    getDeviceCategories(shopId, startDate, endDate),
    getCollectionsViewed(shopId, startDate, endDate),
    getMostAddedItems(shopId, startDate, endDate),
  ]);

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

  const shopAnalyticsReport = {
    catalogVisitsReport,
    itemsViewedReport,
    ordersCreatedReport,
    purchaseRevenueReport,
  };

  res.json({
    searchReport,
    deviceCategoryReport,
    topCollectionsReport,
    itemsAnalyticsReport,
    shopAnalyticsReport,
  });
}
