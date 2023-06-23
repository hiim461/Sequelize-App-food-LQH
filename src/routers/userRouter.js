import express from "express";
import {
  getUserLikeRes,
  getUserLiked,
  userAddRate,
  getUserRated,
  userCreateOrder,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/get-user-liked", getUserLiked);

userRouter.get("/get-user-like-res/:userid/:resid", getUserLikeRes);

userRouter.post("/create-user-rate-res/:user_id/:res_id", userAddRate);

userRouter.get("/get-user-rated", getUserRated);

userRouter.post("/create-order/:food_id", userCreateOrder);

export default userRouter;
