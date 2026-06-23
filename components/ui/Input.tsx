import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-navy font-inter">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-inter text-navy placeholder:text-gray-400 transition-all duration-150",
            "focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20",
            "disabled:bg-gray-50 disabled:opacity-60",
            error && "border-red-400 focus:ring-red-200",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500 font-inter">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
