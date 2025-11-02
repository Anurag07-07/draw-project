import {z} from 'zod'

export const UserSignupValidation = z.object({
  username:z.string(),
  password:z.string(),
})

export const UserSigninValidation = z.object({
  username:z.string(),
  password:z.string(),
})
export const UserChatValidation = z.object({
  slug:z.string(),
})