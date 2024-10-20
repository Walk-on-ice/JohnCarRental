"use client";

import Image from "next/image";
import { Button } from "@components/ui/button"; // Import the Button component
import { useEffect, useState } from "react"; // Import useEffect and useState
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter(); // Initialize the router
  const [isMounted, setIsMounted] = useState(false); // State to check if component is mounted

  useEffect(() => {
    setIsMounted(true); // Set isMounted to true when the component mounts
  }, []);

  const handleScroll = () => {
    if (isMounted) {
      router.push("/CarCataloguePage"); // Redirect to the CarCatalogue section
    }
  };

  return (
    <div className="hero">
      <div className="flex-1 pt-36 padding-x">
        <h1 className="hero__title">
          Find, book, rent a car—quick and super easy!
        </h1>

        <p className="hero__subtitle">
          Streamline your car rental experience with our effortless booking
          process.
        </p>

        <Button
          variant="default"
          size="lg"
          className="bg-primary-blue text-white rounded-full mt-10"
          onClick={handleScroll}
        >
          Explore Cars
        </Button>
      </div>
      <div className="hero__image-container">
        <div className="hero__image">
          <Image src="/hero.png" alt="hero" fill className="object-contain" />
        </div>

        <div className="hero__image-overlay" />
      </div>
    </div>
  );
};

export { Hero };