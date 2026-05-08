import { nanoid } from "nanoid";
import { shortenerPostRequestBodySchema } from "../validation/req.validation.js"

import db from "../db/db.index.js";
import { urlsTable } from "../models/url.model.js";
import {and, eq } from "drizzle-orm";

export async function handlePostUrl(req,res) {
    
    try {
        
        const validationResult=await shortenerPostRequestBodySchema.safeParseAsync(req.body);

        if(validationResult.error){
            return res.status(400).json({
                error:validationResult.error
            })
        }

        const {url,code}=validationResult.data;

        const shortCode=code ?? nanoid(6);

        const [result] = await db.insert(urlsTable).values({
            shortCode,
            targetUrl:url,
            //beacuse middleware se aa rha hai id  
            userId:req.user.id
        })
        .returning({
            id:urlsTable.id,
            shortCode:urlsTable.shortCode,
            targetUrl:urlsTable.targetUrl,
        })

        return res.status(201).json({
            id:result.id,
            shortCode:result.shortCode,
            targetUrl:result.targetUrl
        })


    } catch (error) {
        return res.status(501).json({message:"Internal server error",error})
    }
}


export async function getAllUrls(req,res) {
    
    try {
        
        const codes=await db.select()
        .from(urlsTable)
        .where(eq(urlsTable.userId,req.user.id))

        return res.json({codes})

    } catch (error) {
       return res.status(501).json({message:"Internal server error",error})  
    }

}
export async function deleteUrl(req,res) {
    
    try {
        const id=req.params.id
        await db.delete(urlsTable)
        .where(and(eq(urlsTable.id,id)),eq(urlsTable.userId,req.user.id))

        return res.status(200).json({deleted:true})

    } catch (error) {
       return res.status(501).json({message:"Internal server error",error})  
    }
}


export async function getShortCode(req,res){
   try {
        const code=req.params.shortCode
       const[result]= await db.select({
        targetUrl:urlsTable.targetUrl,
       })
        .form(urlsTable)
       .where(eq(urlsTable.shortCode,code))
        return res.status(200).json({deleted:true})

        if(!result){
            return res.status(404).json({
                error:'Invalid URL'
            })
        }

        return res.redirect(result.targetUrl)


    } catch (error) {
       return res.status(501).json({message:"Internal server error",error})  
    }
}

