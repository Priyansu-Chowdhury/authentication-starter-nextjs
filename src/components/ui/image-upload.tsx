import React from "react";
import { UploadCloud, X, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";
import { UploadResponse } from "@/types/types";

const ImageUpload = ({
  size = "square",
  className,
  onChange,
  value,
}: {
  size?: "square" | "video" | "wide";
  className?: string;
  onChange?: (data: UploadResponse | null) => void;
  value?: string | null;
}) => {
  const [loading, setLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_URL}/api/images/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        console.error("Failed to upload image");
        toast.error("Failed to upload image");
        return;
      }

      const data = await response.json();
      onChange?.(data);
    } catch (error) {
      console.error("Failed to upload image", error);
      toast.error("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-md border-dashed p-4 flex justify-center items-center cursor-pointer border-2",
        value ? "border-transparent group" : "border-primary",
        size === "square" && "aspect-square h-40",
        size === "video" && "aspect-video h-40",
        size === "wide" && "w-full h-40",
        className,
        loading && "cursor-not-allowed opacity-50"
      )}
      onClick={() => {
        if (loading) return;
        if (value) {
          onChange?.(null);
          return;
        }
        inputRef.current?.click();
      }}
    >
      {value ? (
        <>
          <Image
            src={value}
            fill
            alt={"Uploaded Image"}
            className="rounded-md"
            objectFit="cover"
            objectPosition="center"
          />
          <div className="absolute inset-0 bg-black opacity-0 rounded-md group-hover:opacity-90 transition-all duration-200 flex justify-center items-center">
            <X
              size={16}
              className="text-destructive group-hover:scale-[5] delay-150 transition-all duration-200"
            />
          </div>
        </>
      ) : loading ? (
        <div className="flex flex-col items-center space-y-2">
          <Loader size={24} className="animate-spin text-primary" />
          <span className="text-primary font-medium text-sm text-center w-full">
            Uploading...
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-2">
          <UploadCloud size={24} className="text-primary" />
          <span className="text-primary font-medium text-sm text-center w-full">
            Upload Image
          </span>
          <input
            aria-label="Upload Image"
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
