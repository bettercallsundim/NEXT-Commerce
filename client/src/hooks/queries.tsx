"use client";
// import { successToast } from "@/helpers/toaster";
import useZustand from "@/hooks/useZustand";
import api from "@/lib/api";
import { success } from "@/lib/toast";
import { Vendor } from "@/prisma-types";
import { createShopSchema } from "@/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

export const useSignIn = () => {
  const { setUser } = useZustand();
  const { mutate, isPending, data, error, isError, isSuccess } = useMutation({
    mutationFn: async (input: {
      email: string;
      name: string;
      picture: string;
    }) => {
      const res = await api.post("/user/sign-in", input, {
        withCredentials: true,
      });

      if (!res.data.success) {
        throw new Error("Error Occured");
      }
      return res.data;
    },
    onSuccess: (data) => {
      setUser(data.data);
    },
  });
  return { mutate, data, isPending, error };
};

export const useAuth = () => {
  const { error, data, isPending } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const response = await api.get("/user/authPersist", {
        withCredentials: true,
      });
      if (!response.data.success) {
        throw new Error("Error Occured");
      }
      return response.data.data;
    },
  });

  return { error, data, isPending };
};

export const useSignOut = () => {
  const { mutate, error, data } = useMutation({
    mutationFn: async () => {
      const response = await api.get("/user/sign-out", {
        withCredentials: true,
      });
      return response.data;
    },
  });

  return { signOut: mutate, error, data };
};

export const useGetCategoriesTree = () => {
  const { error, data, isPending } = useQuery({
    queryKey: ["categoriesTree"],
    queryFn: async () => {
      const response = await api.get("/category/all/tree", {
        withCredentials: true,
      });
      if (!response.data.success) {
        throw new Error("Error Occured");
      }
      return response.data;
    },
  });

  return { error, data, isPending };
};

export const useCreateProduct = () => {
  const {
    mutate: createProduct,
    isPending,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: async (productData: {
      name: string;
      description: string;
      price: number;
      category: string;
      stock: number;
      colors: { name: string; code: string }[];
      sizes: string[];
      pictures: any[];
    }) => {
      let res = await api.post("/product/create", productData, {
        withCredentials: true,
      });
      return res;
    },
    onSuccess: (data) => {},
  });
  return { createProduct, isPending, error };
};

export const useCreateOrder = () => {
  const {
    mutate: createOrder,
    isPending,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: async ({ products, address, phone }: any) => {
      let res = await api.post(
        "/order/create",
        {
          products,
          address,
          phone,
        },
        {
          withCredentials: true,
        }
      );
      return res;
    },
    onSuccess: (data) => {
      if (data.data.success) {
        successToast("Order Created");
      }
    },
  });
  return { createOrder, isPending, error };
};

export const useCreateShop = () => {
  // const { setUser } = useZustand();
  const queryClient = useQueryClient();
  const { mutate, isPending, data, error, isError, isSuccess } = useMutation({
    mutationFn: async (input: z.infer<typeof createShopSchema>) => {
      const res = await api.post("/vendor/create", input, {
        withCredentials: true,
      });

      if (!res.data.success) {
        throw new Error("Error Occured");
      }
      queryClient.invalidateQueries({ queryKey: ["all-shop"] });

      return res.data;
    },
    onSuccess: (data) => {
      success("Shop Created");
      // setUser(data.data);
    },
  });
  return { mutate, data, isPending, error };
};

export const useGetAllShop = () => {
  const { error, data, isPending } = useQuery<Vendor[]>({
    queryKey: ["all-shop"],
    queryFn: async () => {
      const response = await api.get("/vendor/all", {
        withCredentials: true,
      });
      if (!response.data.success) {
        throw new Error("Error Occured");
      }
      return response.data.data;
    },
  });

  return { error, data, isPending };
};

export { api as myAxios };
