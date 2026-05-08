import z from "zod";

export const useTokenSchema=z.object({
    id:z.string(),
})