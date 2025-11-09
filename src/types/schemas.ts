import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Correo electrónico inválido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida'),
});

export const passwordSchema = z
  .string()
  .min(8, 'Mínimo 8 caracteres')
  .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
  .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número')
  .regex(/[^a-zA-Z0-9]/, 'Debe contener al menos un carácter especial (!@#$%^&*)')
  .max(100, 'Máximo 100 caracteres');

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
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

export const passwordRequirements = [
  { id: 'length', label: 'Mínimo 8 caracteres', regex: /.{8,}/ },
  { id: 'lowercase', label: 'Al menos una letra minúscula (a-z)', regex: /[a-z]/ },
  { id: 'uppercase', label: 'Al menos una letra mayúscula (A-Z)', regex: /[A-Z]/ },
  { id: 'number', label: 'Al menos un número (0-9)', regex: /[0-9]/ },
  { id: 'special', label: 'Al menos un carácter especial (!@#$%^&*)', regex: /[^a-zA-Z0-9]/ },
];
