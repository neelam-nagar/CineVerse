import { getReviewsByMovie, submitReview } from "../controllers/reviewController.js";
import { deleteReview, updateReview } from "../controllers/reviewController.js";
import authenticate from "../middleware/authMiddleware.js";
import express from "express";

const router = express.Router();

router.get("/:tmdb_id", getReviewsByMovie);
router.post("/", authenticate, submitReview);
router.delete("/delete-review/:id", authenticate, deleteReview);
router.put("/update-review/:id", authenticate, updateReview);

export default router;
