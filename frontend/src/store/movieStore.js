// src/store/movieStore.js
import { create } from "zustand";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Mapping readable genre names → TMDb genre IDs
const GENRE_MAP = {
  Action: 28,
  Comedy: 35,
  Drama: 18,
  "Sci-Fi": 878,
  Horror: 27,
  Romance: 10749,
  Thriller: 53,
  Documentary: 99,
};

const defaultStartYear = 2000;
const defaultEndYear = new Date().getFullYear();

const useMovieStore = create((set, get) => ({
  // state
  trendingMovies: [],
  filteredMovies: [],
  searchedMovies: [],
  loadingSearch: false,
  genresList: Object.keys(GENRE_MAP),
  selectedGenreName: null,
  selectedGenreId: null,
  startYear: defaultStartYear,
  endYear: defaultEndYear,
  loadingTrending: false,
  loadingFiltered: false,
  movieDetails: [],   // 👈 holds current movie details
  movieReviews: [],           // 👈 holds reviews for the movie
  loading: false,
  error: null,

  // fetch trending
  fetchTrendingMovies: async (limit = 10) => {
    try {
      set({ loadingTrending: true });
      const res = await axios.get(`${API_BASE}/movies/trending?limit=${limit}`);
      const movies = Array.isArray(res.data)
        ? res.data.slice(0, limit).sort((a, b) => b.popularity - a.popularity)
        : [];
      set({ trendingMovies: movies, loadingTrending: false });
    } catch (err) {
      console.error("fetchTrendingMovies error:", err);
      set({ loadingTrending: false });
    }
  },

  // fetch filtered
  fetchMoviesByFilters: async (genreId, startYear, endYear) => {
    if (!genreId || !startYear || !endYear) {
      set({ filteredMovies: [] });
      return;
    }

    try {
      set({ loadingFiltered: true });
      const res = await axios.get(`${API_BASE}/movies/filter`, {
        params: { genreId, startYear, endYear },
      });
      const movies = Array.isArray(res.data)
        ? res.data.filter((m) => m.poster_path !== null).sort((a, b) => b.popularity - a.popularity)
        : [];
      set({ filteredMovies: movies, loadingFiltered: false });
    } catch (err) {
      console.error("fetchMoviesByFilters error:", err);
      set({ filteredMovies: [], loadingFiltered: false });
    }
  },

  // set genre and auto-fetch
  setSelectedGenreByName: (name) => {
    const id = GENRE_MAP[name] || null;
    set({ selectedGenreName: name || null, selectedGenreId: id });
    if (id) {
      const { startYear, endYear } = get();
      get().fetchMoviesByFilters(id, startYear, endYear); 
    } else {
      set({ filteredMovies: [] });
    }
  },

  // set years and auto-fetch
  setStartYear: (year) => {
    const y = Number(year);
    set({ startYear: y });
    const { selectedGenreId, endYear } = get();
    if (selectedGenreId) {
      get().fetchMoviesByFilters(selectedGenreId, y, endYear);
    }
  },

  setEndYear: (year) => {
    const y = Number(year);
    set({ endYear: y });
    const { selectedGenreId, startYear } = get();
    if (selectedGenreId) {
      get().fetchMoviesByFilters(selectedGenreId, startYear, y);
    }
  },

  // optional manual trigger
  applyFilters: () => {
    const { selectedGenreId, startYear, endYear } = get();
    if (selectedGenreId) {
      get().fetchMoviesByFilters(selectedGenreId, startYear, endYear);
    }
  },

  // reset everything
  clearFilters: () => {
    set({
      selectedGenreName: null,
      selectedGenreId: null,
      startYear: defaultStartYear,
      endYear: defaultEndYear,
      filteredMovies: [],
    });
  },

   // search action
  searchMovies: async (query) => {
    if (!query) {
      set({ searchedMovies: [] });
      return;
    }
    try {
      set({ loadingSearch: true });
      const res = await axios.get(`${API_BASE}/movies/search`, {
        params: { query },
      });
      const movies = Array.isArray(res.data)
        ? res.data.filter((m) => m.poster_path).sort((a, b) => b.popularity - a.popularity)
        : [];
      set({ searchedMovies: movies, loadingSearch: false });
    } catch (err) {
      console.error("searchMovies error:", err);
      set({ searchedMovies: [], loadingSearch: false });
    }
  },

  clearSearch: () => set({ searchedMovies: [] }),

  // 🆕 Fetch movie details (from backend that calls TMDB + DB for reviews)
  fetchMovieDetails: async (id) => {
  set({ loadingMovie: true });
  try {
    const movieRes = await axios.get(`http://localhost:5000/api/movies/${id}`);
    const reviewsRes = await axios.get(`http://localhost:5000/api/reviews/${id}`);

    set({
      movieDetails: movieRes.data,
      movieReviews: reviewsRes.data,
      loadingMovie: false,
    });
  } catch (err) {
    console.error("Error fetching movie details:", err.message);
    set({ loadingMovie: false });
  }
},


  // Clear selected movie when leaving detail page
  clearMovieDetails: () => set({ movieDetails: [], movieReviews: [] }),


}));



export default useMovieStore;
