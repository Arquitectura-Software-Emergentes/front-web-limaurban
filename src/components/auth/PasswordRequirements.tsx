import { Check, X } from "lucide-react";
import { passwordRequirements } from "@/types/schemas";

interface PasswordRequirementsProps {
  password: string;
  show: boolean;
}

export function PasswordRequirements({ password, show }: PasswordRequirementsProps) {
  if (!show) return null;

  return (
    <div className="mt-2 sm:mt-3 p-3 sm:p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg sm:rounded-xl border border-slate-200 shadow-sm">
      <p className="text-[10px] sm:text-xs font-semibold text-slate-700 mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
        <span className="w-0.5 sm:w-1 h-3 sm:h-4 bg-[#00C48E] rounded-full"></span>
        Requisitos de contraseña
      </p>
      <ul className="space-y-1.5 sm:space-y-2">
        {passwordRequirements.map((req) => {
          const isValid = req.regex.test(password);
          return (
            <li 
              key={req.id} 
              className={`flex items-start gap-2 sm:gap-2.5 text-[10px] sm:text-xs transition-all duration-200 ${
                isValid ? 'opacity-100' : 'opacity-60'
              }`}
            >
              <span className={`mt-0.5 flex-shrink-0 rounded-full p-0.5 ${
                isValid ? 'bg-green-100' : 'bg-slate-200'
              }`}>
                {isValid ? (
                  <Check size={10} className="sm:w-3 sm:h-3 text-green-600" strokeWidth={3} />
                ) : (
                  <X size={10} className="sm:w-3 sm:h-3 text-slate-400" strokeWidth={2.5} />
                )}
              </span>
              <span className={`leading-relaxed ${
                isValid ? 'text-green-700 font-medium' : 'text-slate-600'
              }`}>
                {req.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
