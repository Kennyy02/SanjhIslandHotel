import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing

// --- Modal Component (Same as before) ---
const Modal = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <p className="text-lg font-semibold text-gray-800">{message}</p>
        <button
          onClick={onClose}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
        >
          OK
        </button>
      </div>
    </div>
  );
};

// --- Title Component (Same as before) ---
const Title = ({ title, subTitle }) => {
  return (
    <div className="text-center mb-10">
      <h2 className="text-4xl font-playfair font-bold text-gray-900">{title}</h2>
      <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">{subTitle}</p>
    </div>
  );
};

// --- StarRating Component (Same as before) ---
const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <svg
        key={i}
        className={`w-5 h-5 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.927 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
      </svg>
    );
  }
  return <div className="flex">{stars}</div>;
};

// --- Testimonial Component (Modified for MySQL Backend and "Show More") ---
const Testimonial = ({ showModal }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    review: '',
    rating: 5,
    address: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  // Define your backend API URL
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;// IMPORTANT: Change this to your backend's actual URL!

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/testimonials`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTestimonials(data);
    } catch (err) {
      console.error("Error fetching testimonials:", err);
      setError("Failed to load testimonials. Please try again later.");
      if (typeof showModal === 'function') {
        showModal("Failed to load testimonials. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }, [showModal]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTestimonial(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRatingChange = (newRating) => {
    setNewTestimonial(prevState => ({
      ...prevState,
      rating: newRating
    }));
  };

  const handleSubmitTestimonial = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    try {
      const response = await fetch(`${API_BASE_URL}/api/testimonials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTestimonial.name,
          address: newTestimonial.address,
          review: newTestimonial.review,
          rating: parseInt(newTestimonial.rating, 10), // Ensure rating is an integer
          image_url: `https://placehold.co/48x48/aabbcc/ffffff?text=${newTestimonial.name.charAt(0).toUpperCase()}`
        }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Backend might send error details
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      setNewTestimonial({ name: '', review: '', rating: 5, address: '' }); // Clear form
      if (typeof showModal === 'function') {
        showModal("Testimonial submitted successfully!");
      }
      fetchTestimonials(); // Re-fetch testimonials to show the new one
    } catch (err) {
      console.error("Error adding testimonial:", err);
      setError(`Failed to submit testimonial: ${err.message}`);
      if (typeof showModal === 'function') {
        showModal(`Failed to submit testimonial: ${err.message}`);
      }
    }
  };

  // Limit testimonials to display
  const displayedTestimonials = testimonials.slice(0, 4);
  const hasMoreTestimonials = testimonials.length > 4;

  const handleShowMore = () => {
    navigate('/feedbacks'); // Navigate to the new feedbacks page
  };

  return (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 pt-20 pb-30 font-inter'>
      <Title
        title="What Our Guests Say"
        subTitle="Discover why discerning travelers consistently choose Sanjh Island Hotel for their exclusive and luxurious accommodations around Roxas, Oriental Mindoro."
      />

      {/* Testimonials Display */}
      <div className="flex flex-wrap justify-center gap-6 mt-10 w-full">
        {loading && <p className="text-gray-600 text-lg">Loading testimonials...</p>}
        {error && <p className="text-red-600 text-lg">{error}</p>}
        {!loading && !error && testimonials.length === 0 && (
          <p className="text-gray-600 text-lg">No testimonials yet. Be the first to leave one!</p>
        )}
        {!loading && !error && testimonials.length > 0 && (
          displayedTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow-lg flex flex-col w-full sm:w-80 md:w-96">
              <div className="flex items-center gap-3">
                <img
                  className="w-12 h-12 rounded-full object-cover"
                  src={testimonial.image_url || `https://placehold.co/48x48/aabbcc/ffffff?text=${testimonial.name.charAt(0).toUpperCase()}`}
                  alt={testimonial.name}
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/48x48/aabbcc/ffffff?text=User`; }}
                />
                <div>
                  <p className="font-playfair text-xl font-semibold text-gray-800">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.address}</p>
                </div>
              </div>
              <div className="mt-4">
                <StarRating rating={testimonial.rating} />
              </div>
              <p className="text-gray-700 mt-4 flex-grow">"{testimonial.review}"</p>
            </div>
          ))
        )}
      </div>

      {hasMoreTestimonials && (
        <div className="mt-8 text-center">
          <button
            onClick={handleShowMore}
            className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 text-lg font-medium"
          >
            Show More Testimonials
          </button>
        </div>
      )}

      {/* Add Testimonial Form */}
      <div className="mt-20 w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg">
        <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-6 text-center">Leave Your Feedback</h3>
        <form onSubmit={handleSubmitTestimonial} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newTestimonial.name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Your Location (e.g., City, Country)</label>
            <input
              type="text"
              id="address"
              name="address"
              value={newTestimonial.address}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="review" className="block text-sm font-medium text-gray-700">Your Review</label>
            <textarea
              id="review"
              name="review"
              value={newTestimonial.review}
              onChange={handleInputChange}
              rows="4"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rating</label>
            <div className="flex items-center mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-8 h-8 cursor-pointer ${star <= newTestimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  onClick={() => handleRatingChange(star)}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.927 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
          >
            Submit Testimonial
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Main App Component (Simplified as Firebase is removed) ---
export default function App() {
  const [modalMessage, setModalMessage] = useState(null);

  const showModal = useCallback((message) => {
    setModalMessage(message);
  }, []);

  const closeModal = () => {
    setModalMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap');
          .font-inter { font-family: 'Inter', sans-serif; }
          .font-playfair { font-family: 'Playfair Display', serif; }
        `}
      </style>
      <main>
        {/* Pass showModal to Testimonial component */}
        <Testimonial showModal={showModal} />
      </main>
      <Modal message={modalMessage} onClose={closeModal} />
    </div>
  );
}