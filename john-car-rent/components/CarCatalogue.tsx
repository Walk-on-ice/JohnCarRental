'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImportCarForm from './ImportCarForm'; 
import Image from 'next/image';
import styles from './CarCatalogue.module.css';
import { Button } from '@components/ui/button'; // Import the Button component
import { useToast } from '@components/hooks/use-toast';

// Define the interface for the car items
interface Car {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
}

interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
}

const CarCatalogue = () => {
  const { toast } = useToast();
  const [cars, setCars] = useState<Car[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 5; // Number of cars to display per page

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get<Car[]>('/api/cars');
        setCars(response.data);
        console.log('Fetched cars:', response.data);
      } catch (error) {
        console.error('Error fetching cars:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch cars.',
          variant: 'destructive',
        });
      }
    };
    fetchCars();
  }, []);
  
  const addToCart = (car: Car) => {
    const cartItem: CartItem = {
      id: car.id,
      name: car.name,
      brand: car.brand,
      price: car.price,
      imageUrl: car.imageUrl,
    };

    // Retrieve existing cart from local storage
    const storedCart = localStorage.getItem('cart');
    const cart = storedCart ? JSON.parse(storedCart) : [];

    // Add new item to cart
    cart.push(cartItem);

    // Store updated cart in local storage
    localStorage.setItem('cart', JSON.stringify(cart));

    toast({
      title: 'Success',
      description: 'Car added to cart.',
    });
  };

  const exportCar = async (car: Car) => {
    try {
      const response = await axios.post('/api/export-car', car, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Car exported:', response.data);
      toast({
        title: 'Success',
        description: 'Car exported successfully.',
      });
    } catch (error) {
      console.error('Error exporting car:', error);
      toast({
        title: 'Error',
        description: 'Failed to export car.',
        variant: 'destructive',
      });
    }
  };

  const deleteCar = async (carId: string) => {
    try {
      await axios.delete(`/api/cars/${carId}`);
      setCars((prevCars) => prevCars.filter((car) => car.id !== carId));
      toast({
        title: 'Success',
        description: 'Car deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting car:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete car.',
        variant: 'destructive',
      });
    }
  };

  const rentCar = async (carId: string) => {
    try {
      const response = await axios.post('/api/rentals', {
        carId,
        userId: 'user-id-here', // Replace with actual user ID
        start: new Date(),
      });
      console.log('Car rented:', response.data);
      toast({
        title: 'Success',
        description: 'Car rented successfully.',
      });
    } catch (error) {
      console.error('Error renting car:', error);
      toast({
        title: 'Error',
        description: 'Failed to rent car.',
        variant: 'destructive',
      });
    }
  };

  const handleCarAdded = (newCar: Car) => {
    setCars((prevCars) => [...prevCars, newCar]);
  };

  // Pagination logic
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className={styles.carCatalogue}>
      <ImportCarForm onCarAdded={handleCarAdded} />
      <div className={`${styles.carCardsContainer} ${styles.scrollableContainer}`}>
        {currentCars.map((car) => (
          <div key={car.id} className={styles.carCard}>
            <Image src={car.imageUrl} alt={car.name} width={500} height={300} />
            <h3>{car.name}</h3>
            <p>{car.brand}</p>
            <p>{car.price}$</p>
            <div className={styles.carCardBtnContainer}>
              <Button variant="default" size="sm" onClick={() => addToCart(car)}>Add to Cart</Button>
              <Button variant="default" size="sm" onClick={() => exportCar(car)}>Export Car</Button>
              <Button variant="default" size="sm" onClick={() => deleteCar(car.id)}>Delete Car</Button>
              <Button variant="default" size="sm" onClick={() => rentCar(car.id)}>Rent</Button>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.pagination}>
        {Array.from({ length: Math.ceil(cars.length / carsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? styles.active : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CarCatalogue;