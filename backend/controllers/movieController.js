import tmdb from "../config/tmdb.js";

// 1. Search movie by name
export const searchMovie = async (req, res) => {
  try {
    const { query } = req.query; // ?query=Inception
    if (!query) return res.status(400).json({ message: "Query is required" });

    const response = await tmdb.get("/search/movie", { params: { query } });
    res.json(response.data.results);
  } catch (error) {
    console.error("Search Error:", error.message);
    res.status(500).json({ message: "Error searching movies" });
  }
};

// 2. Get top 10 trending movies
export const trendingMovies = async (req, res) => {
  try {
    const response = await tmdb.get("/trending/movie/week");
    const movies = response.data.results.slice(0, 10); // only top 10
    res.json(movies);
  } catch (error) {
    console.error("Trending Error:", error);
    res.status(500).json({ message: "Error fetching trending movies" });
  }
};

// 3. Filter movies by genre + release year range
export const filterMovies = async (req, res) => {
  try {
    const { genreId, startYear, endYear } = req.query;
    if (!genreId || !startYear || !endYear) {
      return res
        .status(400)
        .json({ message: "genreId, startYear & endYear required" });
    }

    const movies = [];
    const totalPagesToFetch = 5; // fetch first 5 pages for better range coverage

    for (let page = 1; page <= totalPagesToFetch; page++) {
      const response = await tmdb.get("/discover/movie", {
        params: {
          with_genres: genreId,
          "primary_release_date.gte": `${startYear}-01-01`,
          "primary_release_date.lte": `${endYear}-12-31`,
          sort_by: "popularity.desc", // keep latest first
          page,
        },
      });

      if (response.data?.results?.length) {
        movies.push(...response.data.results);
      }
    }

    // remove duplicates by movie id
    const uniqueMovies = Array.from(
      new Map(movies.map((m) => [m.id, m])).values()
    );

    // only return movies that actually fall inside the year range (extra safeguard)
    const filtered = uniqueMovies.filter((m) => {
      const year = m.release_date ? Number(m.release_date.split("-")[0]) : null;
      return year && year >= Number(startYear) && year <= Number(endYear);
    });

    res.json(filtered.slice(0, 50)); // return top 50 results
  } catch (error) {
    console.error("Filter Error:", error.message);
    res.status(500).json({ message: "Error filtering movies" });
  }
};


// 4. Movie details by ID
export const getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await tmdb.get(`/movie/${id}`, {
      params: { append_to_response: "credits" }, // include cast & crew
    });
    res.json(response.data);
  } catch (error) {
    console.error("Details Error:", error.message);
    res.status(500).json({ message: "Error fetching movie details" });
  }
};
