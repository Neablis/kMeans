import Head from 'next/head';
import React from 'react';

import App from '../src/components/App';

export default function Home() {
  return (
    <>
      <Head>
        <title>K Means Display</title>
      </Head>
      <App />
    </>
  );
}
