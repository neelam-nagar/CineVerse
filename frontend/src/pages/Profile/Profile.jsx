// src/pages/Profile/Profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import useAuthStore from "../../store/authStore";
import useReviewStore from "../../store/reviewStore";
import ConfirmationModal from "../../components/ConfirmationModal";
import StarRating from "../../components/StarRating";
import { Edit, Loader, Trash2 } from "lucide-react";

const Profile = () => {
  const { profileData, fetchProfile, loading } = useAuthStore();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10); // ✅ show 10 reviews initially

  const { deleteReview } = useReviewStore();

  useEffect(() => {
    fetchProfile(); // call backend API on mount
  }, [fetchProfile]);

  // Redirect if not logged in
  useEffect(() => {
    if (!profileData && !loading) <Loader></Loader>
  }, [profileData, loading, navigate]);

  if (loading || !profileData)
    return <p className="text-white text-center mt-10">Loading...</p>;

  const { user, reviews } = profileData;

  // Handle delete button click
  const handleDeleteClick = (reviewId) => {
    setSelectedReviewId(reviewId);
    setShowModal(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (selectedReviewId) {
      await deleteReview(selectedReviewId); // ✅ Call store function
      fetchProfile(); // ✅ Refresh profile after delete
      setShowModal(false);
      setSelectedReviewId(null);
    }
  };

  // Load more reviews
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#111418] text-white">
      <Header />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Info */}
          <div className="bg-[#1a1e23] rounded-lg shadow-lg p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="flex-shrink-0">
              <div
                className="bg-center bg-no-repeat bg-cover rounded-full size-32 ring-4 ring-offset-4 ring-offset-[#1a1e23] ring-[#137fec] h-32 w-32"
                style={{
                  backgroundImage: `url(${user.profile_pic || "/avatar.png"})`,
                }}
              ></div>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-white">{user.name}</h2>
              <p className="text-sm text-gray-500 mt-1">
                Joined in {user.joined_year}
              </p>
              <div className="mt-4 flex justify-center md:justify-start space-x-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    {user.total_reviews_posted}
                  </p>
                  <p className="text-sm text-gray-400">Reviews</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    {(user.avg_rating_given/2).toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-400">Avg Rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Reviews */}
          <div className="mt-10">
            <h3 className="text-2xl font-bold text-white mb-6">Your Reviews</h3>
            <div className="space-y-6">
              {reviews.slice(0, visibleCount).map((r, i) => (
                <div
                  key={i}
                  className="bg-[#1a1e23] rounded-lg shadow-lg p-5 flex items-start space-x-4"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${r.poster_path}` || "/avatar.png"}
                    alt={r.movie_title}
                    className="w-24 h-36 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-bold text-white">
                          {r.movie_title}
                        </h4>
                        <div className="flex items-center mt-1">
                          <div className="flex items-center gap-2">
                            <StarRating rating={r.rating} />
                            <p className="text-gray-400 text-sm">
                              {(r.rating.toFixed(1) / 2).toFixed(1)}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-500 text-xs mt-1 font-semibold">
                          Reviewed {r.time_ago}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => navigate(`/reviews/edit/${r.id}`)} className="group p-2 rounded-full hover:bg-[#283039]">
                          <Edit className="w-6 h-6 text-gray-600 group-hover:text-green-400 cursor-pointer" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(r.id)}
                          className="group p-2 rounded-full hover:bg-[#283039]"
                        >
                          <Trash2 className="w-6 h-6 text-gray-600 group-hover:text-red-400 cursor-pointer" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-300 mt-3 text-sm leading-relaxed line-clamp-3">
                      {r.review_text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ✅ Load More button only if more reviews left */}
          {visibleCount < reviews.length && (
            <div className="mt-8 text-center">
              <button
                onClick={handleLoadMore}
                className="bg-[#137fec] hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-md"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* ✅ Confirmation Modal */}
      {showModal && (
        <ConfirmationModal
          onCancel={() => setShowModal(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default Profile;
