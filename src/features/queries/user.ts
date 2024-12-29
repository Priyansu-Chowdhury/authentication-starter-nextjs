import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";
import { client } from "@/lib/rpc";
import { toast } from "sonner";

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

export const useGetUser = (userId: string) => {
  const query = useQuery<GetUserResponseType, Error>({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await client.api.data.users.profile.$get({
        query: { userId },
      });
      const json = await response.json();
      return json;
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
