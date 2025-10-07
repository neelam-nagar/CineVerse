import { where } from "sequelize";
import Review from "../models/review.js";
import User from "../models/User.js";

//Fetch reviews for a given movie
export const getReviewsByMovie = async (req, res) => {
  try {
    const { tmdb_id } = req.params;

    if (!tmdb_id) {
      return res.status(400).json({ message: "tmdb_id is required" });
    }

    const reviews = await Review.findAll({
      where: { tmdb_id },
      include: [
        {
          model: User,
          attributes: ["id", "fullName", "profilePic"], // fetch username + dp
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const submitReview = async (req, res) => {
  try {
    const { tmdb_id, rating, review_text, movie_title, poster_path } = req.body;
    const userId = req.user.id; // extracted from JWT middleware

    if (!tmdb_id || !rating || !review_text || !movie_title) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newReview = await Review.create({
      user_id: userId,
      tmdb_id,
      rating,
      review_text,
      movie_title,
      poster_path
    });

    //  placeholder for ML API call (to be added later)
    const mlResults = {
      sentiment: { label: "positive", confidence: 92.5 },
      spam: { label: "real", confidence: 87.3 },
      bias: { label: "none", confidence: 100 },
    };

    return res.status(201).json({
      message: "Review submitted successfully",
      review: newReview,
      analysis: mlResults, // later this comes from real ML API
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.id; // comes from auth middleware (JWT)

    // Find the review first
    const review = await Review.findOne({ where: { id: reviewId } });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if this review belongs to the logged-in user
    if (review.user_id !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await review.destroy();

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Update Review
export const updateReview = async (req, res) => {

  try {
    const reviewId = req.params.id;
    const userId = req.user.id; // from auth middleware
    const { rating, review_text } = req.body;

    const review = await Review.findOne({ where: { id: reviewId } });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user_id !== userId) {
      return res.status(403).json({ message: "Not authorized to update this review" });
    }

    review.rating = rating || review.rating;
    review.review_text = review_text || review.review_text;

    await review.save();

    res.json({ message: "Review updated successfully", review });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

