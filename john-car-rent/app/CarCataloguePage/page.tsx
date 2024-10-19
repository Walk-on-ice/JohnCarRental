import CarCatalogue from '@/components/CarCatalogue';
import Cart from '@/components/Cart';
import React from 'react';

const Page = () => {
  return (
    <main className="main-container">
      <div className="content-container">
        <h2>Car Catalogue</h2>
        <CarCatalogue />
      </div>
    </main>
  );
};

export default Page;