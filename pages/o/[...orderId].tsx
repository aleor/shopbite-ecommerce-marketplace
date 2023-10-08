import { doc, getDoc } from 'firebase/firestore';

import NotFound from '../../components/NotFound/NotFound';
import ShoppingList from '../../components/ShoppingList/ShoppingList';
import { db } from '../../firebase/firestore';
import { Order, orderConverter, Shop, shopConverter } from '../../models';

const OrderSummary = ({
  order,
  shop,
}: {
  order: Order | null;
  shop: Shop | null;
}) => {
  if (!order || !shop || shop.isAdminBlocked) {
    return <NotFound message="Order detail not found" />;
  }

  return <ShoppingList order={order} shop={shop} />;
};

export async function getServerSideProps(context) {
  const orderId: string = context.query?.orderId?.[0];

  if (!orderId) {
    return {
      props: {
        order: null,
        shop: null,
      },
    };
  }

  const orderSnapshot = await getDoc(
    doc(db, 'orders', orderId).withConverter(orderConverter)
  );

  if (!orderSnapshot.exists()) {
    return {
      props: {
        order: null,
        shop: null,
      },
    };
  }

  const order = orderSnapshot.data();

  const shopSnapshot = await getDoc(
    doc(db, 'shops', order.shopId).withConverter(shopConverter)
  );

  return {
    props: {
      order,
      shop: shopSnapshot.data() || null,
    },
  };
}

export default OrderSummary;
