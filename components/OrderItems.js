/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { FaAngleDoubleRight, FaShippingFast, FaTrashAlt } from 'react-icons/fa';
import { client, urlFor } from '../sanity';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { deleteOrderItems } from '../slices/orderSlice';
import LoadingButton from './LoadingButton';

function OrderItems({ orders, user }) {
  const router = useRouter();

  const dispatch = useDispatch();

  const orderTime = moment(orders._updatedAt).format('ll');

  const images = orders.product._ref;

  const [getProduct, setGetProduct] = useState([]);

  const fetchOrdersImage = async (img) => {
    try {
      const productQuery = `*[_type == 'product' && _id == $img]{
                _id,
                description,
                name,
                price,
                "image":image.asset->url
            }[0]`;

      const products = await client.fetch(productQuery, { img });

      setGetProduct(products);

      return products;
    } catch (error) {
      console.log('error for fetching product image', error);
    }
  };

  useEffect(() => {
    fetchOrdersImage(images);
  }, [images]);

  const [loading, setLoading] = useState(false);

  // cancel orders request
  const handleCancelOrders = async (order) => {
    setLoading(true);

    async function orderCancel() {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        try {
          // cancel date timestamp
          const cancelDate = Date.now();

          const orderId = order._id;

          // const fetchOrder = await client.fetch(`*[_type == 'order' && _id == $orderId][0]`, { orderId });
          const query = `*[_type == 'order' && _id == $orderId][0]`;

          const fetchOrder = await client.fetch(query, { orderId });

          console.log(fetchOrder);

          console.log('orders:', order);

          const response = await client.delete(fetchOrder._id);

          dispatch(deleteOrderItems({ id: orderId }));

          setLoading(false);

          // add to orderCancel order schema
          if (response) {
            await client.create({
              _type: 'orderCancel',
              user: {
                _type: 'reference',
                _ref: order.user._ref,
              },
              product: {
                _type: 'reference',
                _ref: order.product._ref, // product id
              },
              orderId: order.orderId,
              quantity: order.quantity,
              subTotal: order.subTotal,
              status: 'cancel',
              address: order.address,
              city: order.city,
              country: order.country,
              zipCode: Number(order.zipCode),
              paymentType: order.paymentType,
              cancelDate: moment(cancelDate).format('LLL'),
            });
          }

          resolve(response);
        } catch (error) {
          // If there was an error during the save operation, reject the promise with the error
          reject(error);
        }
      });
    }

    toast.promise(orderCancel(), {
      loading: 'Please wait...',
      success: 'Order Successful cancel please wait for a updates.',
      error: '!Opps something went wrong to cancel orders.',
    });
  };

  return (
    <>
      <div className="fixed top-0 z-[99999]">
        <Toaster />
      </div>
      <div className="w-full h-full">
        {/* head */}
        <div className="w-full h-max p-[0.9rem_1.1rem] border-[1px] border-[#D5D9D9] dark:border-[#96a0a5cc]/20 rounded-[5px_5px_0_0] bg-[#F0F2F2] dark:bg-[#858999]/40 flex slg:flex-row flex-col justify-between">
          {/* left side */}
          <div className="xl:w-[35%] slg:w-1/2 w-full h-full flex xs:flex-row flex-col justify-between xs:gap-0 gap-[10px]">
            {/* order date */}
            <div className="xs:w-auto w-full flex xs:flex-col flex-row xs:justify-normal justify-between gap-[0.3rem]">
              <span className="text-[0.9rem] text-[#565959]/90 dark:text-[#BABECD]/90">
                Order Placed :
              </span>
              <span className="text-[0.9rem] text-[#565959] dark:text-[#BABECD] font-[500]">
                {orderTime}
              </span>
            </div>
            {/* total */}
            <div className="xs:w-auto w-full flex xs:flex-col flex-row xs:justify-normal justify-between gap-[0.3rem]">
              <span className="text-[0.9rem] text-[#565959]/90 dark:text-[#BABECD]/90">
                Total :
              </span>
              <span className="text-[0.9rem] font-[500] text-[#565959] dark:text-[#BABECD]">
                ₹{new Intl.NumberFormat().format(orders.subTotal)}
              </span>
            </div>
            {/* ship to user name */}
            <div className="xs:w-auto w-full flex xs:flex-col flex-row xs:justify-normal justify-between gap-[0.3rem]">
              <span className="text-[0.9rem] text-[#565959]/90 dark:text-[#BABECD]/90">
                Ship To :
              </span>
              <span className="text-[0.9rem] text-[#565959] dark:text-[#BABECD] font-[500] capitalize">
                {user}
              </span>
            </div>
          </div>
          {/* line */}
          <div className="w-full h-[1px] slg:hidden block bg-[#d5dbdb] dark:bg-[#96a0a5cc]/20 my-[1rem]"></div>
          {/* right side */}
          <div className="xl:w-[65%] slg:w-1/2 w-full h-full flex justify-end">
            <div className="slg:w-max w-full flex flex-col gap-[0.3rem]">
              <p className="text-[0.9rem] slg:w-max w-full flex items-center justify-between text-[#565959]/90 dark:text-[#BABECD]/80">
                Order ID :{' '}
                <span className="font-[500] text-[#565959] dark:text-[#BABECD]">
                  #{orders.orderId}
                </span>
              </p>
              <div className="w-full flex items-center slg:justify-end">
                <button
                  title={`Track Your Order`}
                  onClick={() =>
                    router.push(`/orders/orderId/${orders.orderId}`)
                  }
                  id="trackBtn"
                  type="button"
                  role="button"
                  aria-label="track-order"
                  className="text-[#565959] dark:text-[#BABECD] text-[0.9rem] w-max font-[500] capitalize relative flex items-center slg:justify-end justify-start"
                >
                  track orders
                  <span>
                    <FaAngleDoubleRight size={16} />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* contents */}
        <div className="w-full h-max p-[0.9rem_1.1rem] border-[1px] border-[#D5D9D9] dark:border-[#96a0a5cc]/20 rounded-[0_0_5px_5px] flex slg:flex-row flex-col slg:gap-0 gap-[25px] justify-between">
          {/* left side */}
          <div className="slg:w-[70%] w-full flex slg:flex-row flex-col gap-[18px]">
            {/* product images */}
            <div className="slg:max-w-[140px] w-full mx-auto h-full max-h-[120px] flex items-center justify-center bg-[#E7EDEF] dark:bg-[#101219]/30 rounded-[3px] overflow-hidden group">
              {getProduct.image && (
                <Image
                  onClick={() =>
                    router.push(`/product-details/${getProduct._id}`)
                  }
                  src={urlFor(getProduct.image).url()}
                  width={150}
                  height={120}
                  alt={getProduct.name}
                  title={`${getProduct.name} Product Details Page`}
                  className="w-full h-[120px] max-h-[120px] py-[10px] object-contain cursor-pointer group-hover:scale-[1.1] transition-transform"
                />
              )}
            </div>
            {/* product description and prices and qty */}
            <div className="w-full h-max flex flex-col gap-[15px]">
              {/* description */}
              <p
                className="font-[600] text-[#565959] text-[18px] dark:text-[#BABECD] cursor-pointer hover:underline"
                title={`${getProduct.name} Product Details Page`}
                onClick={() =>
                  router.push(`/product-details/${getProduct._id}`)
                }
              >
                {getProduct.description && getProduct.description.length >= 97
                  ? `${getProduct.description.slice(0, 97)}...`
                  : getProduct.description}
              </p>
              {/* prices and qty */}
              <div className="w-full flex items-center gap-[20px]">
                {/* prices */}
                <p className="font-[400] text-[#565959]/90 dark:text-[#BABECD]/90">
                  Price:{' '}
                  <span className="font-[500] text-[#565959] dark:text-[#BABECD]">
                    ₹{new Intl.NumberFormat().format(getProduct.price)}
                  </span>
                </p>
                {/* qty */}
                <p className="font-[400] text-[#565959]/90 dark:text-[#BABECD]/80">
                  Qty:{' '}
                  <span className="font-[500] text-[#565959] dark:text-[#BABECD]">
                    {orders.quantity}
                  </span>
                </p>
                {/* payment type */}
                <p className="font-[400] text-[#565959]/90 dark:text-[#BABECD]/90 capitalize">
                  payment type:{' '}
                  <span
                    className={`font-[500] capitalize ${
                      orders.paymentType === 'stripe'
                        ? 'text-[#635BFF]'
                        : 'text-green-500'
                    }`}
                  >
                    {orders.paymentType}
                  </span>
                </p>
              </div>
            </div>
          </div>
          {/* right side buttons */}
          <div className="slg:w-max w-full flex flex-col gap-[22px] items-end justify-center">
            {/* view products */}
            <button
              type="button"
              role="button"
              //   onClick={() => router.push(`/product-details/${getProduct._id}`)}
              onClick={() => router.push(`/orders/orderId/${orders.orderId}`)}
              title='Track Your Order'
              aria-label="view-product"
              className="shadow-[0_2px_4px_rgba(0,0,0,0.3)] font-[500] hover:shadow-none w-full text-[16px] h-[50px] p-[0.6rem_1.4rem] border-[1px] border-[#101219] dark:border-[#BABECD] text-[#101219] dark:text-[#BABECD] dark:hover:opacity-75 rounded-[3px] flex items-center justify-center gap-[8px] capitalize"
            >
              {/* icons */}
              <span>
                {/* <FaRegEye size={16} /> */}
                <FaShippingFast size={16} />
              </span>
              track order
            </button>
            {/* cancel button */}
            <button
              type="button"
              title={`Cancel ${getProduct.name} Order Items`}
              disabled={loading}
              onClick={() => handleCancelOrders(orders)}
              role="button"
              aria-label="cancel-order"
              className={`shadow-[0_2px_4px_rgba(0,0,0,0.3)] font-[500] hover:shadow-none w-full text-[16px] h-[50px] p-[0.6rem_1.4rem] bg-[#fd5555] hover:opacity-90 dark:hover:opacity-75 text-white rounded-[3px] flex items-center justify-center gap-[8px] ${
                loading === true ? 'opacity-80 cursor-not-allowed' : ''
              }`}
            >
              {loading === true ? (
                <LoadingButton />
              ) : (
                <>
                  {/* icons */}
                  <span>
                    <FaTrashAlt size={16} />
                  </span>
                </>
              )}
              Cancel order
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderItems;
