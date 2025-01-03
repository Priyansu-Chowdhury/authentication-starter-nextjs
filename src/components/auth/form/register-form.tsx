"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateUser } from "@/features/queries/user";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

const formSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().min(2).max(200),
  password: z.string().min(2).max(50),
});

const RegisterForm = () => {
  const createUser = useCreateUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createUser.mutate(values, {
      onSuccess: () => {
        signIn("credentials", {
          email: values.email,
          password: values.password,
        });
        form.reset();
        toast.loading("Wait we are logging you in...😊");
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
                  disabled={createUser.isPending}
                  {...field}
                />
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Johndoe@gmail.com"
                  disabled={createUser.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="******"
                  disabled={createUser.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={createUser.isPending}
        >
          {createUser.isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
