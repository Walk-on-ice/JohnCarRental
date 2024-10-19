'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define the interface for the cart items
interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
}

const Cart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutMessage, setCheckoutMessage] = useState<string>('');

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get<CartItem[]>('/api/cart');
        setCart(response.data);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };
    fetchCart();
  }, []);

  const handleCheckout = async () => {
    try {
      const response = await axios.post<{ message: string }>('/api/checkout', { cart });
      setCheckoutMessage(response.data.message);
      setCart([]); // Clear the cart after successful checkout
    } catch (error) {
      console.error('Error during checkout:', error);
      setCheckoutMessage('Checkout failed. Please try again.');
    }
  };

  return (
    <div className="cart">
      <h2>Cart</h2>
      {cart.map((car, index) => (
        <div key={index} className="cart-item">
          <h3>{car.name}</h3>
          <p>{car.brand}</p>
          <p>${car.price}</p>
        </div>
      ))}
      <button onClick={handleCheckout}>Checkout</button>
      {checkoutMessage && <p>{checkoutMessage}</p>}
    </div>
  );
}

export default Cart;