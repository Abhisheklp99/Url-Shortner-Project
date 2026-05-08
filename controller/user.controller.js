import { error } from "node:console"
import { getUserByEmail } from "../services/user.services.js"
import { loginRequestBodySchema, signupPostRequestBodySchema } from "../validation/req.validation.js"
import hashPasswordWithSalt from "../utils/hash.js"
import { usersTable } from "../models/user.model.js"
import db from "../db/db.index.js"
import { createUserToken } from "../utils/token.js"

export async function handleSignup(req,res) {
    

    try {
        const validationResult=await signupPostRequestBodySchema.safeParseAsync(req.body)

        if(validationResult.error){
            return res.status(400).json({
                error:validationResult.error.format()
            })
        }

        const {firstname,lastname,email,password}=validationResult.data
        
        // console.log(firstname);
        const existingUser=await getUserByEmail(email);
        // console.log(existingUser);
        if(existingUser){
            return res.status(400)
            .json({
                error:`User with email ${email} already exits!`
            })
        }

        const {salt,password:hashPassword}=hashPasswordWithSalt(password);

        // console.log(salt,password);

          const [user]=await db.insert(usersTable).values({
              email,
                firstname,
                lastname,
                salt,
                password:hashPassword,

            })
            .returning({
                id:usersTable.id
            })

            console.log(user);

            return res.status(201).json({
                data:{userId:user.id}
            })

    } catch (error) {
        
        return res.status(501).json({message:"Internal Server Error",error})
    }
}

export async function handleLogin(req,res) {

    try {

        const validationResult=await loginRequestBodySchema.safeParseAsync(req.body);

        if(validationResult.error){
              return res.status(400).json({
                error:validationResult.error.format()
            })
        }

        const {email,password}=validationResult.data;

        const user= await getUserByEmail(email);

        if(!user){
            return res.status(404)
            .json({
                error:`User with ${email} doesn't exits`
            })
        }

        const {password:hashPassword}=hashPasswordWithSalt(password,user.salt)

        if(user.password !==hashPassword){
            return res.status(400).json({
                error:"Invalid password"
            })
        }

        const token=await createUserToken({id:user.id})


        return res.json({token})


        
    } catch (error) {
         return res.status(501).json({message:"Internal Server Error",error})
    }
    
}