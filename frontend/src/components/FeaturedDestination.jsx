import React, { useEffect, useState } from 'react';
import HotelCard from './HotelCard';
import Title from './Title';
import { useNavigate } from 'react-router-dom';

const FeaturedDestination = () => {
  const navigate = useNavigate();
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchFeaturedRooms = async () => {
      try {
        // Fetch rooms list and ratings summary in parallel
        const [roomsRes, ratingsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/rooms`),
          fetch(`${API_BASE_URL}/room-ratings-summary`),
        ]);

        if (!roomsRes.ok) {
          throw new Error(`Rooms HTTP error! status: ${roomsRes.status}`);
        }
       
        const roomsData = await roomsRes.json();
        let ratingsSummary = {};
        try {
          ratingsSummary = ratingsRes && ratingsRes.ok ? await ratingsRes.json() : {};
        } catch (_) {
          ratingsSummary = {};
        }

        // Take the first 4 rooms for the featured section and merge rating data
        const firstFourRooms = roomsData.slice(0, 4).map((room) => {
          const summary = ratingsSummary?.[room.id] || {};
          const averageRating = Number(summary.averageRating) || 0;
          const reviewCount = Number(summary.reviewCount) || 0;
          return { ...room, averageRating, reviewCount };
        });

        setFeaturedRooms(firstFourRooms);
      } catch (error) {
        console.error("Failed to fetch featured rooms:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedRooms();
  }, []); // Empty dependency array means this effect runs once after the initial render

  if (loading) {
    return (
      <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>
        <Title title='Featured Destination' subTitle='Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experience.'/>
        <div className='mt-20 text-xl'>Loading featured destinations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>
        <Title title='Featured Destination' subTitle='Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experience.'/>
        <div className='mt-20 text-xl text-red-600'>Error: {error.message}. Please try again later.</div>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>
      <Title title='Featured Destination' subTitle='Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experience.'/>

      <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
        {featuredRooms.map((room) => (
          // Assuming room._id from dummy data maps to room.id from your MySQL DB
          <HotelCard key={room.id} room={room} />
        ))}
      </div>

      <button
        onClick={() => { navigate('/rooms'); window.scrollTo(0, 0); }}
        className='my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer'
      >
        View All Destination
      </button>
    </div>
  );
};

export default FeaturedDestination;