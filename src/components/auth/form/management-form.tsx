"use client";

import React, { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import LogoutBtn from "@/components/auth/logout-btn";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import { useSession } from "next-auth/react";
import { useGetUser } from "@/features/queries/user";
import { Role } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import ImageUpload from "@/components/ui/image-upload";

const updateFormSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().min(2).max(200),
  emailVerified: z.string().optional().nullable(),
  image: z.string().url().optional().nullable(),
  role: z.nativeEnum(Role),
});

const ManagementForm = () => {
  const { status } = useSession();
  const { data, isPending } = useGetUser();

  const form = useForm<z.infer<typeof updateFormSchema>>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      name: "",
      email: "",
      emailVerified: null,
      image: "",
      role: Role.USER,
    },
  });

  useEffect(() => {
    if (data?.status === 200 && data.user) {
      form.reset({
        name: data.user.name || "",
        email: data.user.email || "",
        emailVerified: data.user.emailVerified || null,
        image: data.user.image || "",
        role: data.user.role || "",
      });
    }
  }, [data, form]);

  function onSubmit(values: z.infer<typeof updateFormSchema>) {
    console.log(values);
  }

  if (isPending || status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated" || !data) {
    return null;
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardContent className="p-0 space-y-4">
            <ImageUpload
              value={form.watch("image")}
              onChange={(file) => {
                if (!file) {
                  form.setValue("image", null);
                  return;
                }
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                  form.setValue("image", reader.result as string);
                };
              }}
            />
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
            <FormField
              control={form.control}
              name="emailVerified"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                      checked={field.value ? true : false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel
                      className={cn(
                        "text-sm font-medium",
                        field.value ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? "Email is verified"
                        : "Email is not verified"}
                    </FormLabel>
                    <FormDescription>
                      {field.value
                        ? "Your email is verified and can be used for notifications"
                        : "Please verify your email to receive notifications"}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="p-0 justify-between">
            <LogoutBtn>Exit from account</LogoutBtn>
            <Button
              type="submit"
              effect={"expandIcon"}
              icon={Save}
              iconPlacement="left"
            >
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Form>
    </>
  );
};

export default ManagementForm;
