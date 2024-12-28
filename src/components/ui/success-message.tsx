import { CheckCircle2 } from "lucide-react";
import React from "react";

const SuccessMessage = ({ message }: { message: string }) => {
  return (
    <div className="p-2 w-full flex gap-2 items-center text-emerald-500 bg-emerald-100 rounded-md border border-emerald-200 text-sm font-semibold">
      <CheckCircle2 size={16} />
      <p>{message}</p>
    </div>
  );
};

export default SuccessMessage;
