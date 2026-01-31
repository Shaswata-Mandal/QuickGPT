import React, { useEffect, useState } from 'react'
import { assets, dummyPlans } from '../assets/assets';
import Loading from './Loading';
import { useAppContext } from '../context/AppContext';
import { useClerk } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

const Credits = () => {

  const { openSignIn } = useClerk();
  const { lastPurchasedPlan, freeCredits, user, isSignedIn, getToken, axios, fetchCreditDetails, navigate, setLastPurchasedPlan, plans } = useAppContext();

  const [loading, setLoading] = useState(true);

  const fetchLastPurchasedPlanDetail = async () => {

    setLoading(true);

    try {

      const token = await getToken();

      const { data } = await axios.get('/api/user/last-purchase', { headers: { Authorization: token } })

      if (data.success) {
        setLastPurchasedPlan(data.plan);
      }
      else {
        toast.error(data.message);
      }

    } catch (error) {
      // console.log(error.message);
    } finally {
      setLoading(false);
    }

  }

  useEffect(() => {

    if (isSignedIn) {

      fetchLastPurchasedPlanDetail();

    }

  }, []);

  const initPay = async (order) => {

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Credits Payment",
      description: "Credits Payment",
      order_id: order.id,
      plan: order.plan,
      credits: order.credits,
      handler: async (response) => {

        const token = await getToken();

        // console.log(response)

        //verifying the payment
        try {

          const { data } = await axios.post('/api/plans/verify-razor', response, { headers: { Authorization: token } });

          if (data.success) {
            fetchCreditDetails();
            navigate("/");
            toast.success("Credits Added");
          }
          else {
            toast.error(data.message);
          }

        } catch (error) {
          toast.error(error.message);
        }

      },
      theme: {
        color: "#3399cc",
      },
      //If user closes the modal (without paying)
      modal: {
        ondismiss: function (response) {
          toast.error("Payment process was cancelled.");
        },
      },
    }

    const rzp = new window.Razorpay(options);
    rzp.open();

  }

  const paymentRazorpay = async (planId) => {

    if (!isSignedIn) {
      openSignIn();
      return;
    }

    if (planId === 'Free') {
      return;
    }

    try {

      const token = await getToken();

      //initiating payment data for our database and getting a order data from razorpay
      const { data } = await axios.post('/api/plans/pay-razor', { planId }, { headers: { Authorization: token } });

      if (data.success) {

        //initiating the razorpay ui for payment, verification and task after successful payment
        initPay(data.order);

      }

    } catch (error) {
      // console.log(error);
      toast.error(error.message);
    }

  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className='w-full mx-auto px-4 sm:px-6 lg:px-8 py-5'>

      <div className='min-h-[80vh] text-center mb-5'>

        <h2 className='text-3xl font-semibold text-center mb-5  text-gray-800 dark:text-white'>Our Plans</h2>

        <h1 className='px-3 text-center text-2xl md:text-3xl lg:text-4xl font-semibold bg-gradient-to-r from-gray-900 to-gray-400 bg-clip-text text-transparent mb-6 sm:mb-8 dark:invert'>Choose the plan that's right for you</h1>

        <div className='flex flex-wrap justify-center gap-10 text-left'>

          {plans.map((item, index) => (

            <div
              className={`${item.id === "Free" && isSignedIn ? (freeCredits > 0 ? "bg-green-100" : "bg-red-100") : (item.id === lastPurchasedPlan ? "bg-pink-100" : (item.popular ? "bg-blue-100 sm:scale-103" : "bg-white"))} drop-shadow-sm border rounded-lg flex flex-col gap-5 py-10 px-8 text-gray-600 hover:scale-102 transition-all duration-500 min-h-[530px]`}
              key={index}
            >

              <div className='flex flex-col flex-1'>

                {/* Last Purchased Tag */}
                {lastPurchasedPlan === item.id && (
                  <div className="absolute -top-3 -right-3 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Last Purchased
                  </div>
                )}

                {/* Most Popular Tag */}
                {item.popular === true && lastPurchasedPlan !== item.id && (
                  <div className="absolute -top-3 -right-3 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Most Popular
                  </div>
                )}

                <img className='w-45' src={assets.logo_full_dark} alt="" />

                <p className='mt-3 mb-1 font-semibold'>{item.id}</p>

                <p className='text-sm'>{item.desc}</p>

                {item.features.length > 0 && (

                  <div>
                    <p className='mt-3 font-semibold'>Features:</p>
                    <ul className='pt-2'>

                      {item.features.map((feature, index) => (
                        <li key={index} className='text-sm flex flex-row'>
                          <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}

                    </ul>
                  </div>

                )}

                <p className='mt-auto'>
                  <span className='text-3xl font-medium'>&#8377; {item.price.toLocaleString("inr")}</span>
                  / {item.credits} credits
                </p>

              </div>


              {/* Purchase Button Logic */}
              {item.id === 'Free' ? (

                isSignedIn ? (

                  <button
                    className={`cursor-not-allowed w-full mt-auto text-sm rounded-md py-2.5 min-w-52 ${user && freeCredits > 0
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-500 text-white '
                      }`}
                    disabled={user && freeCredits <= 0}
                  >
                    {freeCredits > 0 ? `Remaining Free Credits: ${freeCredits}` : 'Exhausted'}
                  </button>

                ) : (

                  <button
                    className='cursor-pointer w-full bg-gray-800 text-white mt-auto text-sm rounded-md py-2.5 min-w-52'
                    onClick={() => paymentRazorpay(item.id)}
                  >
                    Get Started
                  </button>

                )

              ) : (

                <button
                  className='cursor-pointer w-full bg-gray-800 text-white mt-auto text-sm rounded-md py-2.5 min-w-52'
                  onClick={() => paymentRazorpay(item.id)}
                >
                  {isSignedIn ? 'Purchase' : 'Get Started'}
                </button>

              )}

            </div>

          ))}

        </div>

      </div>

    </div>
  )
}

export default Credits;

export const CreditsPage = () => {

  return (
    <div className='overflow-y-scroll'>
      <Credits />
    </div>
  );

};