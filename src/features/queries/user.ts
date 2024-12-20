import { useMutation } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";
import { client } from "@/lib/rpc";
import { toast } from "sonner";

type CreateUserRequestType = InferRequestType<
  (typeof client.api.data.users.register)["$post"]
>["json"];

type CreateUserResponseType = InferResponseType<
  (typeof client.api.data.users.register)["$post"]
>;

export const useCreateUser = () => {
  const mutation = useMutation<
    CreateUserResponseType,
    Error,
    CreateUserRequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.data.users.register.$post({ json });
      return response.json();
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return mutation;
};
