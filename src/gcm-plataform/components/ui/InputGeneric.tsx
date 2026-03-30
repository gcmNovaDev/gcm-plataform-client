import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  classNameLabel?: string;
  classNameInput?: string;
}

const InputGeneric: React.FC<InputProps> = ({
  label,
  error,
  classNameLabel = "",
  classNameInput = "",
  id,
  ...props
}) => {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

  const [showPassword, setShowPassword] = useState(false);
  const isPassword = props.type === "password";

  return (
    <div className={`flex flex-col gap-1.5 w-full ${props.className || ""}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={`text-sm font-medium text-app-gray-2-500 ${classNameLabel}`}
        >
          {label}
        </label>
      )}
      <div className="relative w-full">
        <input
          id={inputId}
          className={`w-full px-3 py-2.5 rounded-md border border-app-gray-1-300 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all placeholder:text-app-gray-1-400 text-app-gray-2-900 ${
            error ? "border-alert-error" : ""
          } ${isPassword ? "pr-10" : ""} ${classNameInput}`}
          {...props}
          type={isPassword && showPassword ? "text" : props.type}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-app-gray-1-400 hover:text-app-gray-2-600 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-alert-error-text mt-1">{error}</p>}
    </div>
  );
};

export default InputGeneric;
