import { useMutation, useQuery } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";
import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

type CreateUserRequestType = InferRequestType<
  (typeof client.api.data.users.register)["$post"]
>["json"];

type CreateUserResponseType = InferResponseType<
  (typeof client.api.data.users.register)["$post"]
>;

type GetUserResponseType = InferResponseType<
  (typeof client.api.data.users.profile)["$get"]
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

export const useGetUser = () => {
  const { data } = useSession();
  const userId = data?.user?.id;

  const query = useQuery<GetUserResponseType, Error>({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await client.api.data.users.profile.$get({
        query: { userId },
      });

      return response.json();
    },
    enabled: !!userId,
    retry: false,
  });

  return query;
};
