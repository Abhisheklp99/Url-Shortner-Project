import { Router } from "express";
import { handleLogin, handleSignup } from "../controller/user.controller.js";

const userRouter=Router();

userRouter.post('/signup',handleSignup)
userRouter.post('/login',handleLogin)


export default userRouter