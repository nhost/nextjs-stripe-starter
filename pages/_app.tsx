import 'styles/main.css';
import 'styles/chrome-bug.css';

import React from 'react';

import Layout from 'components/Layout';
import { AppProps } from 'next/app';

import { NhostNextProvider, SignedIn, SignedOut } from '@nhost/nextjs';
import { nhost } from '@/utils/nhost';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/utils/react-query-client';
import SignIn from './signin';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="bg-black">
      <QueryClientProvider client={queryClient}>
        <NhostNextProvider nhost={nhost}>
          <Layout>
            <SignedIn>
              <Component {...pageProps} />
            </SignedIn>
            <SignedOut>
              <SignIn />
            </SignedOut>
          </Layout>
        </NhostNextProvider>
      </QueryClientProvider>
    </div>
  );
}
