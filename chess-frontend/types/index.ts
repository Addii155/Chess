import {z} from "zod";


export const CreateUserSchema = z.object({
    username: z.string().min(3).max(20),
    email: z.string(),
    password: z.string().min(6),
});


export const LoginUserSchema = z.object({
    email: z.string(),
    password: z.string().min(6),
});

export const SignUpUserSchema = CreateUserSchema;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type LoginUserInput = z.infer<typeof LoginUserSchema>;