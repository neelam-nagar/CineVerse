import express from "express";
import {
  searchMovie,
  trendingMovies,
  filterMovies,
  getMovieDetails,
} from "../controllers/movieController.js";

const router = express.Router();

router.get("/search", searchMovie);
router.get("/trending", trendingMovies);
router.get("/filter", filterMovies);
router.get("/:id", getMovieDetails);

export default router;
