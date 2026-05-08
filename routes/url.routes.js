import { Router } from "express";
import { ensureAuthenticated } from "../middleware/auth.middleware.js";
import { deleteUrl, getAllUrls, getShortCode, handlePostUrl } from "../controller/url.controller.js";



export const urlRouter=Router();

urlRouter.post('/shorten',ensureAuthenticated,handlePostUrl);
urlRouter.get('/codes',ensureAuthenticated ,getAllUrls);
urlRouter.delete('/:id',ensureAuthenticated ,deleteUrl);
urlRouter.get('/:id',getShortCode);