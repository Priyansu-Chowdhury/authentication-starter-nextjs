import { AlertCircle } from "lucide-react";
import React from "react";

const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <div className="p-2 w-full flex gap-2 items-center text-red-500 bg-red-100 rounded-md border border-red-200 text-sm font-semibold">
      <AlertCircle size={16} />
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
