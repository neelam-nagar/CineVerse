// src/pages/Reviews/EditReview.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useReviewStore from "../store/reviewStore";
import Header from "../components/Header";
import Footer from "../components/Footer";

const EditReview = () => {
  const { id } = useParams(); // review id
  const navigate = useNavigate();
  const { profileData, fetchProfile } = useAuthStore();
  const { updateReview } = useReviewStore();

  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [movie_title, setMovieTitle] = useState("Movie Name");
  const [poster_path, setPosterPath] = useState("/path/to/poster.jpg");

  // Load existing review data from profile
  useEffect(() => {
    if (profileData) {
      const r = profileData.reviews?.find((rev) => rev.id === parseInt(id));
      if (r) {
        setContent(r.review_text);
        setRating(r.rating / 2); // backend stores in /10 scale, convert to /5
        setMovieTitle(r.movie_title);
        setPosterPath(r.poster_path);
      }
    }
  }, [id, profileData]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const backendRating = Math.ceil(rating * 2); // convert 5 scale → 10 scale
      await updateReview(id, {
        rating: backendRating,
        review_text: content,
        movie_title,
        poster_path,
      });

      await fetchProfile();
      navigate("/profile");
    } catch (err) {
      console.error("Failed to update review:", err);
      alert("Failed to update review. Try again.");
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
          onClick={() => setRating(hover || rating)}
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

  if (!content && !profileData)
    return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-[#111418] text-white flex flex-col items-center p-8">
        <h1 className="text-4xl font-bold mb-4">Edit Your Review</h1>
        <form className="w-full max-w-2xl space-y-4" onSubmit={handleUpdate}>
          <div>
            <label className="block mb-2">Review Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Update your review..."
              className="w-full p-3 rounded-md bg-[#1c2127] text-white border border-gray-600 focus:border-blue-500 min-h-[120px]"
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
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-md font-bold mt-4"
          >
            Update Review
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default EditReview;
