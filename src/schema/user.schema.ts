import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    email: string({ required_error: "Email é necessário" }).email(
      "Email inválido"
    ),
    password: string({ required_error: "A senha é obrigatória" })
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .max(32, "A senha deve ter no máximo 32 caracteres"),
    passwordConfirm: string({
      required_error: "A confimação de senha é obrigatória",
    }),
    role: string().optional(),
  }).refine((data) => data.passwordConfirm === data.password, {
    path: ["passwordConfirm"],
    message: "As senhas não batem",
  }),
});

export const loginUserSchema = object({
  body: object({
    email: string({ required_error: "Email é necessário" }).email(
      "Email inválido"
    ),
    password: string({ required_error: "A senha é obrigatória" }).min(
      8,
      "Email ou senha inválidos"
    ),
  }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];
export type LoginUserInput = TypeOf<typeof loginUserSchema>["body"];
