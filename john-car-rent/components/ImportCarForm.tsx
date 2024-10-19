import React, { useState } from 'react';
import Image from 'next/image';
import styles from './ImportCarForm.module.css';

// Define the interface for the car items
interface Car {
  id: number;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
}

interface ImportCarFormProps {
  onCarAdded: (newCar: Car) => void;
}

const ImportCarForm: React.FC<ImportCarFormProps> = ({ onCarAdded }) => {
  const [car, setCar] = useState<Car>({ id: 0, name: '', brand: '', price: 0, imageUrl: '' });
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onCarAdded(car);
    setCar({ id: 0, name: '', brand: '', price: 0, imageUrl: '' }); // Reset form
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  return (
    <div className={styles.importCarFormContainer}>
      <div className={styles.importCarForm}>
        <h2>Import Car Form</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={car.name}
            onChange={(e) => setCar({ ...car, name: e.target.value })}
            placeholder="Car Name"
          />
          <input
            type="text"
            value={car.brand}
            onChange={(e) => setCar({ ...car, brand: e.target.value })}
            placeholder="Car Brand"
          />
          <input
            type="number"
            value={car.price}
            onChange={(e) => setCar({ ...car, price: parseFloat(e.target.value) })}
            placeholder="Car Price"
          />
          <input
            type="text"
            value={car.imageUrl}
            onChange={(e) => setCar({ ...car, imageUrl: e.target.value })}
            placeholder="Car Image URL"
          />
          <button type="submit">Add Car</button>
        </form>
      </div>
      {car.imageUrl && (
        <div className={styles.carImagePreview}>
          {isImageLoading && <p>Loading image...</p>}
          <Image
            src={car.imageUrl}
            alt={car.name}
            width={300}
            height={200}
            objectFit="contain"
            onLoadingComplete={handleImageLoad}
          />
        </div>
      )}
    </div>
  );
};

export default ImportCarForm;