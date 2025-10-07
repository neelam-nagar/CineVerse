// src/components/ReviewForm.jsx
import React, { useState } from "react";
import StarRating from "./StarRating";

const ReviewForm = ({ initialData = {}, onSubmit }) => {
  const [rating, setRating] = useState(initialData.rating || 0);
  const [reviewText, setReviewText] = useState(initialData.review_text || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, review_text: reviewText });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-[#1a1e23] p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-white">
        {initialData.id ? "Edit Review" : "Write a Review"}
      </h2>

      {/* Star Rating */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Rating</label>
        <div className="flex">
          <StarRating rating={rating} />
          <input
            type="number"
            min="0"
            max="10"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="ml-3 bg-gray-800 text-white p-2 rounded"
          />
        </div>
      </div>

      {/* Review Text */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Your Review</label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="w-full h-32 bg-gray-800 text-white p-3 rounded resize-none"
          placeholder="Write your thoughts..."
        />
      </div>

      <button
        type="submit"
        className="bg-[#137fec] hover:bg-blue-600 text-white px-6 py-2 rounded font-semibold"
      >
        {initialData.id ? "Update Review" : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;
