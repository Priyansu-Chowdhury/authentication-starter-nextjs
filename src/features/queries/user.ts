import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

type UpdateUserRequestType = InferRequestType<
  (typeof client.api.data.users.update)["$put"]
>["json"];

type UpdateUserResponseType = InferResponseType<
  (typeof client.api.data.users.update)["$put"]
>;

type GetUserResponseType = InferResponseType<
  (typeof client.api.data.users.profile)["$get"]
>;

export const useCreateUser = () => {
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
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
  });

  return query;
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    UpdateUserResponseType,
    Error,
    UpdateUserRequestType
  >({
    mutationFn: async (json) => {
      const response = await client.api.data.users.update.$put({ json });
      return response.json();
    },
    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return mutation;
};
