'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import styles from './Cart.module.css'; // Import the CSS module
import { useSession } from 'next-auth/react';

// Define the interface for the cart items
interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
}

const Cart: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    // Fetch cart items from local storage or API
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const handleDelete = (id: string) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleCheckout = async () => {
    if (!session?.user) {
      setMessage('User not logged in');
      return;
    }

    // Log the cart and userId for debugging
    console.log('Cart:', cart);
    console.log('User Email:', session.user.email);

    try {
      // Fetch the user's ObjectId from the database
      const userResponse = await axios.get(`/api/users?email=${session.user.email}`);
      const userId = (userResponse.data as { id: string }).id;

      const response = await axios.post<{ message: string }>('/api/checkout', {
        cart,
        userId,
      });

      setMessage(response.data.message);

      // Clear the cart after successful checkout
      setCart([]);
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('Error during checkout:', error);
      setMessage('Error during checkout');
    }
  };

  return (
    <div className={styles.cart}>
      <h2 className={styles.cartTitle}>Cart</h2>
      {cart.map((car, index) => (
        <div key={index} className={styles.cartItem}>
          <Image src={car.imageUrl} alt={car.name} width={100} height={100} className={styles.cartItemImage} />
          <div className={styles.cartItemDetails}>
            <h3 className={styles.cartItemName}>{car.name}</h3>
            <p className={styles.cartItemBrand}>{car.brand}</p>
            <p className={styles.cartItemPrice}>${car.price}</p>
            <button
              className={`${styles.deleteButton}`}
              onClick={() => handleDelete(car.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      <button className={styles.checkoutButton} onClick={handleCheckout}>Checkout</button>
      {message && <p className={styles.checkoutMessage}>{message}</p>}
    </div>
  );
}

export default Cart;