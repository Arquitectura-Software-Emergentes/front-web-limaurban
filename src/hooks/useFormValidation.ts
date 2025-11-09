import { useState } from "react";
import { z } from "zod";

interface FieldError {
  message: string;
}

export function useFormValidation() {
  const [errors, setErrors] = useState<Record<string, FieldError>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const validateField = (
    fieldName: string,
    value: string,
    schema: z.ZodTypeAny
  ) => {
    try {
      schema.parse(value);
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const zodError = error as z.ZodError;
        setErrors((prev) => ({
          ...prev,
          [fieldName]: { message: zodError.issues[0]?.message || "Error de validación" },
        }));
      }
      return false;
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouchedFields((prev) => new Set(prev).add(fieldName));
  };

  const shouldShowError = (fieldName: string) => {
    return touchedFields.has(fieldName) && errors[fieldName];
  };

  const getError = (fieldName: string) => {
    return errors[fieldName]?.message;
  };

  const clearErrors = () => {
    setErrors({});
    setTouchedFields(new Set());
  };

  return {
    errors,
    validateField,
    handleBlur,
    shouldShowError,
    getError,
    clearErrors,
  };
}
