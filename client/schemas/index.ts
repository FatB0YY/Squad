import * as z from 'zod'
import { ChannelType, UserRole } from '@prisma/client'

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Email is required'
  }),
  password: z.string().min(1, {
    message: 'Password is required'
  }),
  twofacode: z.optional(z.string())
})

export const RegisterSchema = z.object({
  email: z.string().email({
    message: 'Email is required'
  }),
  password: z.string().min(6, {
    message: 'Minimum of 6 characters required'
  }),
  name: z.string().min(1, {
    message: 'Name is required'
  })
})

export const ResetSchema = z.object({
  email: z.string().email({
    message: 'Email is required'
  })
})

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: 'Minimum of 6 characters required'
  })
})

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnable: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6))
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false
      }

      return true
    },
    {
      message: 'New password is required!',
      path: ['newPassword']
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false
      }

      return true
    },
    {
      message: 'Password is required!',
      path: ['password']
    }
  )

export const ServerInitialSchema = z.object({
  name: z.string().min(1, {
    message: 'Server name is required.'
  }),
  image: z.string().min(1, {
    message: 'Server image is required.'
  })
})

export const CreateServerSchema = z.object({
  name: z.string().min(1, {
    message: 'Server name is required.'
  }),
  imageUrl: z.string().min(1, {
    message: 'Server image is required.'
  })
})

export const EditServerSchema = z.object({
  name: z.string().min(1, {
    message: 'Server name is required.'
  }),
  imageUrl: z.string().min(1, {
    message: 'Server image is required.'
  })
})

export const CreateChannelSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Channel name is required.'
    })
    .refine((name) => name !== 'general', {
      message: "Channel name cannot be 'general'"
    }),
  type: z.nativeEnum(ChannelType)
})

export const EditChannelSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Channel name is required.'
    })
    .refine((name) => name !== 'general', {
      message: "Channel name cannot be 'general'"
    }),
  type: z.nativeEnum(ChannelType)
})
