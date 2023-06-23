import express from "express";
import { getResRated, getRestaurantLiked } from "../controllers/restaurantController.js";

const restaurantRouter = express.Router();

restaurantRouter.get("/get-restaurant-liked", getRestaurantLiked);

restaurantRouter.get("/get-restaurant-rated", getResRated);

export default restaurantRouter;
