/* eslint-disable no-undef */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store';
import '../styles/globals.css';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from "react-query";
import { SessionProvider } from 'next-auth/react'
import { StrictMode, Suspense, useEffect } from "react";
import { useRouter } from 'next/router'
import Loading from '../components/Loading'
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const queryClient = new QueryClient();
  const router = useRouter()

  // useEffect(() => {
  //   const registerServiceWorker = () => {
  //     if ('serviceWorker' in navigator) {
  //       navigator.serviceWorker
  //         .register('/service-worker.js')
  //         .then(registration => {
  //           console.log('Registered:', registration);
  //         })
  //         .catch(error => {
  //           console.log('Registration failed:', error);
  //         });
  //     }
  //   };

  //   const onLoad = () => {
  //     registerServiceWorker();
  //   };

  //   window.addEventListener('load', onLoad);

  //   return () => {
  //     window.removeEventListener('load', onLoad);
  //   };

  // }, []);

  // const handleRouteChange = url => {
  //   // Check if previous fetch was aborted
  //   if (router.components[router.route] &&
  //     router.components[router.route].error &&
  //     router.components[router.route].error.Cancelled) {
  //     console.log('Previous fetch was aborted')
  //   } else {
  //     router.push(url)
  //   }
  // }

  const handleRouteChange = url => {
    if (router.pathname !== url) {
      console.log('Page hidden');
    } else {
      console.log('Page loaded from bfcache');
    }
  }

  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    }
  }, []);

  return (
    <ThemeProvider enableSystem={false} attribute='class'>
      {/* redux */}
      <Provider store={store}>
        {/* redux persist */}
        <PersistGate loading={null} persistor={persistor}>
          {/* useQuery */}
          <QueryClientProvider client={queryClient}>
            {/* nextAuth providers */}
            {/* <SessionProvider session={pageProps.session}> */}
            <StrictMode>
              <Suspense fallback={<Loading />}>
                <Component {...pageProps} onRouteChange={handleRouteChange} />
                <Analytics />
              </Suspense>
            </StrictMode>
            {/* </SessionProvider> */}
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  )
}
