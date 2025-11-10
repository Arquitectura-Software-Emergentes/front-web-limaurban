import { forwardRef, SelectHTMLAttributes, ReactNode } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  showError?: boolean;
  options: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, icon, showError, options, className, ...props }, ref) => {
    const hasError = showError && error;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              {icon}
            </div>
          )}
          <select
            ref={ref}
            className={`
              block w-full px-4 py-2.5 text-sm text-slate-900
              bg-white border rounded-xl
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              appearance-none cursor-pointer
              ${icon ? "pl-10" : ""}
              pr-10
              ${
                hasError
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-slate-300 focus:ring-[#00C48E] focus:border-[#00C48E] hover:border-slate-400"
              }
              ${className || ""}
            `}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {/* Chevron icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {hasError && (
          <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
            <svg
              className="w-3.5 h-3.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
