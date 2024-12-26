import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideEye, LucideEyeOff } from "lucide-react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const isPasswordType = type === "password";

    return (
      <div className="relative">
        <input
          type={isPasswordType && showPassword ? "text" : type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className,
            isPasswordType && "pr-7"
          )}
          ref={ref}
          {...props}
        />
        {isPasswordType && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center justify-center p-2"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <LucideEyeOff size={16} />
            ) : (
              <LucideEye size={16} />
            )}
          </button>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
