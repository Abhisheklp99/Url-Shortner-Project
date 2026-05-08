import jwt from 'jsonwebtoken';
import { useTokenSchema } from "../validation/token.validation.js"

const JWT_SECRET=process.env.JWT_SECRET


export async function createUserToken(payload) {
    
    //token vakidate kar rhe ki string hai ki ni
    const validationResult=await useTokenSchema.safeParseAsync(payload)

    if(validationResult.error){
        throw new Error(validationResult.error.message)
    }

    const payloadValidationData=validationResult.data;

    const token=jwt.sign(payloadValidationData,JWT_SECRET, { expiresIn: '1h' });

    return token;
    
}

export function validateUserToken(token){
    try {

        const payload=jwt.verify(token,JWT_SECRET);
        return { payload, expired: false };
        
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return { payload: null, expired: true };
        }
        return { payload: null, expired: false };
    }
}
