import { validateUserToken } from "../utils/token.js";

export function authenticationMiddleware(req,res,next){
    
    const authHeader=req.headers["Authorization"];

    if(!authHeader) {
        return next()
    }

    if(!authHeader.startsWith("Bearer")){
        return res.status(400).json({
            error:"Authorization header must start with Bearer"
        })
    }

    const token=authHeader.split(' ')[1];

    const payload=validateUserToken(token);

    req.user=payload;
    next();

}


export function ensureAuthenticated(req,res,next){

    if(!res.user || !req.user.id){
        return res.status(401)
        .json({
            error:"You must be logged in to access this resource"
        })
    }
next()

}