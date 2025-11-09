import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Correo electrónico inválido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(255, 'El nombre es muy largo'),
  email: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Correo electrónico inválido'),
  phone: z
    .string()
    .regex(/^[0-9]{9}$/, 'El teléfono debe tener 9 dígitos')
    .optional()
    .or(z.literal('')),
  userType: z.enum(['CITIZEN', 'MUNICIPALITY_STAFF'] as const),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña es muy larga'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
