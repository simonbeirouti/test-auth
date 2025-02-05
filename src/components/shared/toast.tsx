import { CheckCircle, AlertCircle, Info } from "lucide-react";
import { ToastProps } from "@/types";

const toastStyles = {
  success: {
    bg: "bg-emerald-400",
    icon: CheckCircle,
  },
  error: {
    bg: "bg-red-400",
    icon: AlertCircle,
  },
  info: {
    bg: "bg-blue-400",
    icon: Info,
  },
};

export function Toast({ message, type }: ToastProps) {
  const { bg, icon: Icon } = toastStyles[type];

  return (
    <div
      className={`fixed bottom-4 right-4 ${bg} text-black px-4 py-2 rounded-lg shadow-lg flex items-center gap-2`}
    >
      <Icon className="w-4 h-4" />
      {message}
    </div>
  );
}
