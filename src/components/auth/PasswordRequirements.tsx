import { Check, X } from "lucide-react";
import { passwordRequirements } from "@/types/schemas";

interface PasswordRequirementsProps {
  password: string;
  show: boolean;
}

export function PasswordRequirements({ password, show }: PasswordRequirementsProps) {
  if (!show) return null;

  return (
    <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
      <p className="text-xs font-medium text-slate-700 mb-2">
        Requisitos de contraseña:
      </p>
      <ul className="space-y-1">
        {passwordRequirements.map((req) => {
          const isValid = req.regex.test(password);
          return (
            <li key={req.id} className="flex items-center gap-2 text-xs">
              {isValid ? (
                <Check size={14} className="text-green-600 flex-shrink-0" />
              ) : (
                <X size={14} className="text-slate-400 flex-shrink-0" />
              )}
              <span className={isValid ? "text-green-700" : "text-slate-600"}>
                {req.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
