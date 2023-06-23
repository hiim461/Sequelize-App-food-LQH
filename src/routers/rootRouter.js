import express from "express";
import userRouter from "./userRouter.js";
import restaurantRouter from "./restaurantRouter.js";

const rootRouter = express.Router();

rootRouter.use("/user", userRouter);
rootRouter.use("/restaurant", restaurantRouter);

export default rootRouter;
