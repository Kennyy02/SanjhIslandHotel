import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';


const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const HotelCard = ({ room, index }) => {
  // Use window.scrollTo instead of just scrollTo for broader compatibility
  const handleCardClick = () => {
    window.scrollTo(0, 0);
  };
const imageUrl = room.images && room.images.length > 0
                             ? room.images[0]
                             : assets.placeholderRoomImage;

            console.log(`Constructed image URL for display:`, imageUrl);
            console.log(`----------------------------------`);

const navigate = useNavigate();
  return (
    <Link
      to={'/rooms/' + room.id} // Use room.id instead of room._id
      onClick={handleCardClick}
      key={room.id} // Use room.id instead of room._id
      className='relative max-w-70 w-full rounded-xl overflow-hidden bg-white text-gray-500/90 shadow-[0px_4px_4px_rgba(0,0,0,0.05)]'
    >
     <img
                  onClick={() => {
                    navigate(`/rooms/${room.id}`);
                    window.scrollTo(0, 0); // Use window.scrollTo instead of just scrollTo
                  }}
                  src={imageUrl} // Use the constructed full URL here
                  alt={room.roomType || "hotel room"} // More descriptive alt text
                  title="View Room Details"
                  className="w-full h-48 object-cover cursor-pointer"
                />

      {index % 2 === 0 && (
        <p className='px-3 py-1 absolute top-3 left-3 text-xs bg-white text-gray-800 font-medium rounded-full'>
          Best Seller
        </p>
      )}

      <div className='p-4 pt-5'>
        <div className='flex items-center justify-between'>
          {/* Assuming roomType is the name equivalent from your DB */}
          <p className='font-playfair text-xl font-medium text-gray-800'>{room.roomType}</p>
          <div className='flex items-center gap-1'>
            <img src={assets.starIconFilled} alt="star-icon" /> 4.5
          </div>
        </div>
        <div className='flex items-center gap-1 text-sm'>
          <img src={assets.locationIcon} alt="location-icon" />
          {/* Access address from the parsed owner object */}
          <span>{room.owner?.address || 'Morente Avenue, Bagumbayan, Roxas, Oriental Mindoro '}</span> {/* Provide a fallback address */}
        </div>

        <div className='flex items-center justify-between mt-4'>
          <p>
            <span className='text-xl text-gray-800'>₱{room.pricePerNight}</span>/night
          </p>

          <button
            className='px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50 transition-all cursor-pointer'
          >
            Book Now
          </button>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;