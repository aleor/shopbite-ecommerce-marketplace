import { getAdminAuth } from '../../../firebase/adminAuth';
import { getMostAddedItems } from '../../../libs/api/reports/getMostAddedItems';

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

  const startDate = req.query?.startDate || '7daysAgo';
  const endDate = req.query?.endDate || 'today';

  const itemsAnalyticsReport = await getMostAddedItems(
    shopId,
    startDate,
    endDate
  );

  res.json({
    itemsAnalyticsReport,
  });
}
