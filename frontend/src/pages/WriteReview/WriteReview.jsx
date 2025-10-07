// src/pages/WriteReview/WriteReview.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import axios from "axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const WriteReview = () => {
  const { authUser} = useAuthStore();
  const { id } = useParams(); // movie id
  const navigate = useNavigate();
  const location = useLocation();

  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0); // 0-5, supports half-stars
  const [hover, setHover] = useState(0);

   const { movie_title, poster_path } = location.state || {
    movie_title: "Movie Name",
    poster_path: "/path/to/poster.jpg",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const backendRating = Math.ceil(rating * 2); // 5-star → 10 scale
      const res = await axios.post(
        "http://localhost:5000/api/reviews",
        {
          tmdb_id: id,
          rating: backendRating,
          review_text: content,
          movie_title,
          poster_path,
        },
        { withCredentials: true }
      );

      navigate("/analysis", { state: res.data });
    } catch (err) {
      console.error("Failed to submit review:", err);
      alert("Failed to submit review. Try again.");
    }
  };

  const renderStars = () => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    let fill = 0;
    if (hover > 0) {
      fill = Math.min(Math.max(hover - i + 1, 0), 1);
    } else {
      fill = Math.min(Math.max(rating - i + 1, 0), 1);
    }

    stars.push(
      <div
        key={i}
        className="relative w-8 h-8 cursor-pointer"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          setHover(x < rect.width / 2 ? i - 0.5 : i);
        }}
        onMouseLeave={() => setHover(0)}
        // ✅ For desktop & mobile: clicking directly sets rating
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const clickedValue = x < rect.width / 2 ? i - 0.5 : i;
          setRating(clickedValue);
        }}
        // ✅ Mobile devices (touch)
        onTouchStart={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.touches[0].clientX - rect.left;
          const tappedValue = x < rect.width / 2 ? i - 0.5 : i;
          setRating(tappedValue);
        }}
      >
        {/* Gray star background */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="#374151"
          className="absolute w-8 h-8 top-0 left-0"
        >
          <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.782 1.401 8.168L12 18.896 5.665 23.161l1.401-8.168L1.132 9.211l8.2-1.193z" />
        </svg>
        {/* Yellow filled star */}
        <div
          className="absolute top-0 left-0 h-full overflow-hidden"
          style={{ width: `${fill * 100}%` }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#facc15"
            className="w-8 h-8"
          >
            <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.782 1.401 8.168L12 18.896 5.665 23.161l1.401-8.168L1.132 9.211l8.2-1.193z" />
          </svg>
        </div>
      </div>
    );
  }
  return stars;
};


  return (
  <div>
    <Header />
    <div className="min-h-screen bg-[#111418] text-white flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-8">Write a Review</h1>

      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8 bg-[#1c2127] rounded-lg shadow-lg p-6">
        {/* Poster Image */}
        <div className="flex-shrink-0">
          <img
            src={`https://image.tmdb.org/t/p/w500${poster_path}`}
            alt={movie_title}
            className="w-48 md:w-60 rounded-lg shadow-md"
          />
        </div>

        {/* Movie Title + Form */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">{movie_title}</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2">Review Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your review..."
                className="w-full p-3 rounded-md bg-[#111418] text-white border border-gray-600 focus:border-blue-500 min-h-[120px]"
                required
              />
            </div>

            <div>
              <label className="block mb-2">Rating</label>
              <div className="flex gap-1">{renderStars()}</div>
              <p className="text-gray-400 text-sm mt-1">
                Rating: {rating} / 5
              </p>
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md font-bold mt-4"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

};
  
export default WriteReview;
