import z from "zod";


export const signupPostRequestBodySchema=z.object({
    firstname:z.string(),
    lastname:z.string().optional(),
    email:z.string().email(),
    password:z.string().min(3),
})

export const loginRequestBodySchema=z.object({
    email:z.string().email(),
    password:z.string().min(3),
})

export const shortenerPostRequestBodySchema=z.object({
    url:z.string().url(),
    code:z.string().optional(),
})


