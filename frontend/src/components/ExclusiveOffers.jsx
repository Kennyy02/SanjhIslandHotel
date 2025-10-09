// src/components/ExclusiveOffers.jsx
import React, { useEffect, useState } from 'react'; // Import useState and useEffect
import { assets } from '../assets/assets';
import Title from './Title';
import axios from 'axios'; // Import axios for API calls

const ExclusiveOffers = () => {
  const [exclusiveOffers, setExclusiveOffers] = useState([]); // Declare exclusiveOffers state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const fetchExclusiveOffers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_BASE_URL}/exclusive-offers`);
        setExclusiveOffers(response.data);
      } catch (err) {
        console.error("Error fetching exclusive offers:", err);
        setError("Failed to load exclusive offers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchExclusiveOffers();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return <div className="text-center py-20">Loading exclusive offers...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  if (exclusiveOffers.length === 0) {
    return <div className="text-center py-20">No exclusive offers available at the moment.</div>;
  }

  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32 pt-20 pb-30">
      <Title title="Exclusive Offers" description="Explore our special promotions and packages!" />
      <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300 mt-8">
        View All Offers
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {exclusiveOffers.map((item) => (
          <div
            key={item.id}
            className="group relative flex flex-col items-start justify-between gap-1 pt-12 md:pt-18 px-4 rounded-xl text-white bg-no-repeat bg-cover bg-center"
            style={{ backgroundImage: `url(${BACKEND_BASE_URL}${item.image})` }}
          >
            {/* Display based on discount type */}
            {item.discountType === 'percentage' && (
                <p className="px-3 py-1 absolute top-4 left-4 text-xs bg-white text-gray-800 font-medium rounded-full">
                    {item.discountValue}% OFF
                </p>
            )}
            {item.discountType === 'fixed_amount' && (
                <p className="px-3 py-1 absolute top-4 left-4 text-xs bg-white text-gray-800 font-medium rounded-full">
                    ₱{item.discountValue} OFF
                </p>
            )}
            {item.discountType === 'complimentary_service' && (
                <p className="px-3 py-1 absolute top-4 left-4 text-xs bg-white text-gray-800 font-medium rounded-full">
                    {item.complimentaryServiceDetails}
                </p>
            )}

            <div>
              <p className="text-2xl font-medium font-playfair">{item.title}</p>
              <p>{item.description}</p>
              <p className="text-xs text-white/70 mt-3">
                Expires {new Date(item.validUntil).toLocaleDateString()}
              </p>
            </div>
            <button className="flex items-center gap-2 font-medium cursor-pointer mt-4 mb-5">
              View Offers
              <img
                className="invert group-hover:translate-x-1 transition-all"
                src={assets.arrowIcon}
                alt="arrow-icon"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExclusiveOffers;