import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useMovieStore from "../../store/movieStore";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import StarRating from "../../components/StarRating";
import MovieDetailLoading from "../../components/MovieDetailLoading";
import React from "react";
import useAuthStore from "../../store/authStore";
import { useNavigate } from "react-router-dom";


const MovieDetail = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { id } = useParams();
  const {
    movieDetails,
    movieReviews,
    loadingMovie,
    error,
    fetchMovieDetails,
    clearMovieDetails,
  } = useMovieStore();

  useEffect(() => {
    if (id) {
      fetchMovieDetails(id);
    }
    return () => clearMovieDetails(); // cleanup when leaving
  }, [id, fetchMovieDetails, clearMovieDetails]);

  if (loadingMovie) {
    return <MovieDetailLoading />;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  }

  if (!movieDetails) {
    return null; // nothing to show
  }

  // ---- Aggregate Review Data ----
  const totalReviews = movieReviews.length;

  const avgRating =
    totalReviews > 0
      ? (
        movieReviews.reduce((sum, r) => sum + r.rating / 2, 0) / totalReviews
      ).toFixed(1)
      : 0;

  // Group ratings into 5 buckets
  // Group ratings into 5 buckets
  const ratingGroups = [
    { label: 5, stars: [9, 10] },
    { label: 4, stars: [7, 8] },
    { label: 3, stars: [5, 6] },
    { label: 2, stars: [3, 4] },
    { label: 1, stars: [1, 2] },
  ];

  const ratingCounts = ratingGroups.map((group) => {
    const count = movieReviews.filter((r) =>
      group.stars.includes(r.rating)
    ).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { label: group.label, count, percentage };
  });



  return (
    <div>
      <Header />
      <div className="px-40 py-12 bg-[#111418] min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="md:col-span-1">
            <img
              src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
              alt={movieDetails.title}
              className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow-lg"
            />
          </div>

          {/* Info */}
          <div className="md:col-span-2">
            <h1 className="text-white text-4xl font-bold leading-tight tracking-tighter">
              {movieDetails.title}
            </h1>
            <div className="flex items-center gap-4 mt-2 text-gray-400 text-sm">
              <span>{movieDetails.genres?.map((g) => g.name).join(", ")}</span>
              <span className="text-gray-600">|</span>
              <span>{movieDetails.release_date}</span>
            </div>

            <div className="mt-4">
              <p className="text-white">
                <span className="font-semibold">Runtime:</span>{" "}
                {movieDetails.runtime} min
              </p>
              <p className="text-white mt-1">
                <span className="font-semibold">Rating:</span>{" "}
                {movieDetails.vote_average} / 10
              </p>
            </div>

            <p className="text-gray-300 text-base leading-relaxed mt-6">
              {movieDetails.overview}
            </p>
          </div>
        </div>

        {/* Review Summary Card */}
        <div className="bg-[#1a1e23] rounded-lg p-6 mt-12">
          <div className="flex flex-wrap items-center gap-x-12 gap-y-6">
            {/* Avg Score */}
            <div className="flex flex-col gap-2 items-center">
              <p className="text-white text-5xl font-black leading-tight tracking-tighter">
                {avgRating}
              </p>
              <div className="flex gap-1 text-yellow-400">
                <StarRating rating={avgRating * 2} />
              </div>
              <p className="text-gray-400 text-sm font-normal leading-normal">
                {totalReviews} reviews
              </p>
            </div>

            {/* Distribution */}
            <div className="grid min-w-[240px] max-w-[400px] flex-1 grid-cols-[20px_1fr_40px] items-center gap-y-2">
              {ratingCounts.map((r) => (
                <React.Fragment key={r.label}>
                  <p className="text-white text-sm font-normal leading-normal">
                    {r.label}
                  </p>
                  <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-[#3b4754]">
                    <div
                      className="rounded-full bg-yellow-400"
                      style={{ width: `${r.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-400 text-sm font-normal leading-normal text-right">
                    {r.percentage.toFixed(0)}%
                  </p>
                </React.Fragment>
              ))}
            </div>

          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-3xl font-bold leading-tight tracking-tighter">
              Reviews
            </h2>
            <button onClick={() => {
              navigate(`/write-review/${movieDetails.id}`, {
                state: {
                  movie_title: movieDetails.title,
                  poster_path: `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`,
                },
              });
            }} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-[#1380ec] text-white text-sm font-bold leading-normal tracking-wide hover:bg-blue-500 transition-colors">
              Write a Review
            </button>
          </div>

          {movieReviews.length === 0 ? (
            <p className="text-gray-400">
              No reviews yet. Be the first to write one!
            </p>
          ) : (
            <div className="flex flex-col gap-8">
              {movieReviews.map((review) => (
                <div
                  key={review.id}
                  className="flex flex-col gap-4 p-6 bg-[#1a1e23] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                      style={{
                        backgroundImage: `url(${review.User?.profile_pic || "/avatar.png"
                          })`,
                      }}
                    ></div>
                    <div className="flex-1">
                      <p className="text-white text-base font-medium leading-normal">
                        {review.User?.fullName || "Anonymous"}
                      </p>
                      <p className="text-gray-400 text-sm font-normal leading-normal">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 text-yellow-400">
                    <StarRating rating={review.rating} />
                  </div>

                  <p className="text-gray-300 text-base leading-relaxed">
                    {review.review_text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MovieDetail;
