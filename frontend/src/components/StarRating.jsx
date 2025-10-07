const StarRating = ({ rating }) => {
  // rating is 0-10
  const stars = [0, 1, 2, 3, 4]; // 5 stars
  const starPoints = 2; // each star = 2 points

  return (
    <div className="flex gap-1">
      {stars.map((i) => {
        const fill = Math.min(Math.max(rating - i * starPoints, 0), starPoints) / starPoints;

        return (
          <div key={i} className="relative w-5 h-5">
            {/* Grey star background */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#374151"
              className="w-5 h-5 absolute top-0 left-0"
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
                className="w-5 h-5"
              >
                <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.782 1.401 8.168L12 18.896 5.665 23.161l1.401-8.168L1.132 9.211l8.2-1.193z" />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
};


export default StarRating;
