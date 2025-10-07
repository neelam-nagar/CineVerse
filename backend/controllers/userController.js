import Review from "../models/review.js";
import User from "../models/User.js";

// Helper function to convert timestamp to relative time
const getRelativeTime = (date) => {
  const now = new Date();
  const diff = now - date; // difference in ms

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  return "just now";
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT

    // Fetch user info
    const user = await User.findByPk(userId, {
      attributes: ["id", "fullName", "profilePic", "createdAt"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch reviews
    const reviews = await Review.findAll({
      where: { user_id: userId },
      attributes: ["id", "movie_title", "poster_path", "rating", "review_text", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    // Calculate stats
    const totalReviews = reviews.length;
    const avgRating = totalReviews
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(2)
      : 0;

     const reviewsWithRelativeTime = reviews.map((r) => ({
      id: r.id,
      movie_title: r.movie_title,
      poster_path: r.poster_path,
      rating: r.rating,
      review_text: r.review_text,
      time_ago: getRelativeTime(r.createdAt), // convert to "x min/hours/days ago"
    }));

    res.status(200).json({
      user: {
        id: user.id,
        name: user.fullName,
        profile_pic: user.profilePic,
        joined_year: user.createdAt.getFullYear(),
        total_reviews_posted: totalReviews,
        avg_rating_given: parseFloat(avgRating),
      },
      reviews : reviewsWithRelativeTime,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
