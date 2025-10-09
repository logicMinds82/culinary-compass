import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
  password: string;
}

interface PasswordRule {
  label: string;
  test: (password: string) => boolean;
}

const passwordRules: PasswordRule[] = [
  {
    label: "At least 8 characters",
    test: (password) => password.length >= 8,
  },
  {
    label: "Contains uppercase letter",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    label: "Contains lowercase letter",
    test: (password) => /[a-z]/.test(password),
  },
  {
    label: "Contains number",
    test: (password) => /\d/.test(password),
  },
  {
    label: "Contains special character",
    test: (password) => /[@$!%*?&]/.test(password),
  },
];

export const PasswordStrengthIndicator = ({ password }: PasswordStrengthProps) => {
  if (!password) return null;

  const passedRules = passwordRules.filter((rule) => rule.test(password));
  const strength = passedRules.length;
  
  const getStrengthColor = () => {
    if (strength < 2) return "text-red-400";
    if (strength < 4) return "text-yellow-400";
    return "text-green-400";
  };

  const getStrengthText = () => {
    if (strength < 2) return "Weak";
    if (strength < 4) return "Medium";
    return "Strong";
  };

  return (
    <div className="mt-2 p-3 bg-gray-700 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-300">Password Strength:</span>
        <span className={`text-sm font-medium ${getStrengthColor()}`}>
          {getStrengthText()}
        </span>
      </div>
      
      <div className="w-full bg-gray-600 rounded-full h-2 mb-3">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            strength < 2
              ? "bg-red-500"
              : strength < 4
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
          style={{ width: `${(strength / 5) * 100}%` }}
        ></div>
      </div>
      
      <div className="space-y-1">
        {passwordRules.map((rule, index) => {
          const passed = rule.test(password);
          return (
            <div key={index} className="flex items-center gap-2 text-xs">
              {passed ? (
                <Check className="w-3 h-3 text-green-400" />
              ) : (
                <X className="w-3 h-3 text-red-400" />
              )}
              <span className={passed ? "text-green-400" : "text-gray-400"}>
                {rule.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};