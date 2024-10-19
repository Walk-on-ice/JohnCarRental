'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImportCarForm from './ImportCarForm'; 
import Image from 'next/image';
import styles from './CarCatalogue.module.css';

// Define the interface for the car items
interface Car {
  id: number;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
}

const CarCatalogue = () => {
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
      }
    };
    fetchCars();
  }, []);

  const addToCart = async (car: Car) => {
    await axios.post('/api/cart', { car });
  };

  const exportCar = async (car: Car) => {
    try {
      const response = await axios.post('/api/export-car', car, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Car exported:', response.data);
    } catch (error) {
      console.error('Error exporting car:', error);
    }
  };

  const deleteCar = async (carId: number) => {
    try {
      await axios.delete(`/api/cars/${carId}`);
      setCars((prevCars) => prevCars.filter((car) => car.id !== carId));
    } catch (error) {
      console.error('Error deleting car:', error);
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
            <p>{car.price} baht per day</p>
            <div className={styles.carCardBtnContainer}>
              <button onClick={() => addToCart(car)}>Add to Cart</button>
              <button onClick={() => exportCar(car)}>Export Car</button>
              <button onClick={() => deleteCar(car.id)}>Delete Car</button>
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