import React, { useEffect, useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormState } from "react-hook-form";
import LogoutBtn from "@/components/auth/logout-btn";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Save, Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { useGetUser, useUpdateUser } from "@/features/queries/user";
import { Role } from "@prisma/client";
import ImageUpload from "@/components/ui/image-upload";
import OtpVerificationForm from "./otp-verification";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { format } from "date-fns";
import { toast } from "sonner";

const updateFormSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  image: z.string().optional().nullable(),
  imageMeta: z.object({}).optional().nullable(),
  role: z.nativeEnum(Role),
});

const deviceIcons = {
  chrome: "/device/chrome.png",
  firefox: "/device/firefox.png",
  safari: "/device/safari.png",
  edge: "/device/edge.png",
  windows: "/device/windows.png",
  mac: "/device/mac.png",
  linux: "/device/linux.png",
};

const getDeviceImage = (device: string) => {
  const lowerDevice = device.toLowerCase();
  if (lowerDevice.includes("windows")) return deviceIcons.windows;
  if (lowerDevice.includes("mac")) return deviceIcons.mac;
  if (lowerDevice.includes("linux")) return deviceIcons.linux;
  if (lowerDevice.includes("chrome")) return deviceIcons.chrome;
  if (lowerDevice.includes("firefox")) return deviceIcons.firefox;
  if (lowerDevice.includes("safari")) return deviceIcons.safari;
  if (lowerDevice.includes("edge")) return deviceIcons.edge;
  return "/icons/default.png";
};

const ManagementForm = () => {
  const { status } = useSession();
  const { data, isPending, error, refetch } = useGetUser();
  const { mutate, isPending: isMutating } = useUpdateUser();

  const form = useForm<z.infer<typeof updateFormSchema>>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      name: "",
      email: "",
      image: "",
      role: Role.USER,
    },
  });

  const { isDirty } = useFormState({ control: form.control });

  useEffect(() => {
    if (data?.status === 200 && data.user) {
      form.reset({
        name: data.user.name || "",
        email: data.user.email || "",
        image: data.user.image || "",
        role: data.user.role || Role.USER,
      });
    }
  }, [data, form]);

  const accounts = useMemo(() => {
    if (data?.status === 200 && data.user) {
      return data.user.accounts;
    }
    return [];
  }, [data]);

  function onSubmit(values: z.infer<typeof updateFormSchema>) {
    const cleanValues = Object.fromEntries(
      Object.entries(values).filter(
        ([, value]) => value !== "" && value !== null && value !== undefined
      )
    );

    if (Object.values(cleanValues).some((value) => value === undefined)) {
      toast.error("Please fill all the required fields.");
      return;
    }

    mutate({
      id: data?.user?.id || "",
      email: cleanValues.email as string,
      name: cleanValues.name as string,
      image: cleanValues.image as string,
      role: cleanValues.role as Role,
      imageMeta: cleanValues.imageMeta as object,
    });
  }

  if (isPending || status === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin w-8 h-8 text-gray-500" />
        <p className="ml-2 text-gray-500">Loading user data...</p>
      </div>
    );
  }

  if (error) {
    console.log(error);
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Failed to load user data.</p>
        <Button onClick={() => refetch()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (status === "unauthenticated" || !data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">You are not logged in.</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CardContent className="p-0 space-y-4">
          <div className="flex items-start gap-4">
            <ImageUpload
              value={form.watch("image")}
              onChange={(data) => {
                if (!data) {
                  form.setValue("image", null);
                  return;
                }
                form.setValue("image", data.data.url);
                form.setValue("imageMeta", data.data);
              }}
            />
            <Badge
              variant={
                form.watch("role") === Role.ADMIN ? "default" : "secondary"
              }
            >
              {form.watch("role")}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter your username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <OtpVerificationForm />
          <div className="p-4 border rounded-md bg-gray-50 space-y-4">
            <p className="text-sm font-semibold text-muted-foreground">
              Logged in Accounts
            </p>
            <div className="space-y-2">
              {accounts.length === 0 ? (
                <p className="text-sm text-gray-500">No logged-in accounts.</p>
              ) : (
                accounts.map((account) => {
                  const deviceImage = getDeviceImage(account.device || "");
                  return (
                    <div key={account.id} className="flex items-start gap-2">
                      <Image
                        src={deviceImage}
                        alt={account.device + " icon"}
                        width={80}
                        height={80}
                        className="rounded-full object-contain object-center"
                      />
                      <div className="space-y-0.5 p-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold">
                            {account.device}
                          </p>
                          <Badge variant={"outline"}>{account.provider}</Badge>
                        </div>
                        <p className="text-sm">IP Address: {account.ip}</p>
                        {account.signInTimestamp && (
                          <p className="text-sm">
                            {format(
                              new Date(account.signInTimestamp),
                              "do MMM yyyy"
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-0 justify-between">
          <LogoutBtn>Exit from account</LogoutBtn>
          <Button
            type="submit"
            effect={"expandIcon"}
            icon={isMutating ? Loader : Save}
            iconPlacement="left"
            disabled={isMutating || !isDirty}
          >
            {isMutating ? "Saving..." : "Save changes"}
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
};

export default ManagementForm;
