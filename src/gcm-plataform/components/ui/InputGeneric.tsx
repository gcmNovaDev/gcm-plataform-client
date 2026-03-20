import React from "react";

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
      <input
        id={inputId}
        className={`w-full px-3 py-2.5 rounded-md border border-app-gray-1-300 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all placeholder:text-app-gray-1-400 text-app-gray-2-900 ${
          error ? "border-alert-error" : ""
        } ${classNameInput}`}
        {...props}
      />
      {error && <p className="text-xs text-alert-error-text mt-1">{error}</p>}
    </div>
  );
};

export default InputGeneric;
