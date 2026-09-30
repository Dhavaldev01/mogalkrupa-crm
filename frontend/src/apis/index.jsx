import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { encrypt, decrypt } from "@/helper/crypto";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";

// =======================
// COMMON RESPONSE HANDLER
// =======================
const handleRes = (data) => {
  if (data?.eresponse) {
    try {
      // console.log("inn==>>>");

      return decrypt(data.eresponse);
    } catch (err) {
      // console.log("inn==>>>123");

      console.error("Decrypt failed:", err);
      Cookies.remove("productId");
      return null;
    }
  }
  // console.log("inn==>>>646");

  return data?.response ?? data ?? null;
};

// =======================
// GET
// =======================
export const useGet = (url, key, options = {}) => {
  return useQuery({
    queryKey: [key, url],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get(url);
        return handleRes(data);
      } catch (err) {
        Cookies.remove("product_id");
        throw err;
      }
    },
    enabled: options.enabled ?? true, // 🔥 important
    ...options,
  });
};

// =======================
// GET WITH PARAMS (ENCRYPTED)
// =======================
// export const useGetParams = (url, key, params) => {
//   return useQuery({
//     queryKey: [key, params],
//     queryFn: async () => {
//       const { data } = await axiosInstance.get(url, {
//         params: { payload: encrypt(params) },
//       });
//       return handleRes(data);
//     },
//     keepPreviousData: true,
//   });
// };
export const fetchGetParams = async (url, params) => {
  const { data } = await axiosInstance.get(url, {
    params: { payload: encrypt(params) },
  });
  return handleRes(data);
};

// export const useGetParams = (url, key, params, options = {}) => {
//   return useQuery({
//     queryKey: [key, params],
//     queryFn: async () => {
//       const { data } = await axiosInstance.get(url, {
//         params: { payload: encrypt(params) },
//       });
//       return handleRes(data);
//     },
//     enabled: options.enabled ?? true,
//     ...options,
//     keepPreviousData: true,
//   });
// };
export const useGetParams = (url, key, params, options = {}) => {
  return useQuery({
    queryKey: [key, params],
    queryFn: () => fetchGetParams(url, params),
    enabled: options.enabled ?? true,
    ...options,
    keepPreviousData: true,
  });
};

// =======================
// GET BY ID
// =======================
export const useGetById = (url, key, id) => {
  return useQuery({
    queryKey: [key, id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`${url}/${id}`);
      return handleRes(data);
    },
    enabled: !!id,
  });
};

export const useGetByIdParams = (
  url,
  key,
  id,
  params = {},
  options = {}
) => {

  return useQuery({
    queryKey: [
      key,
      id,
      JSON.stringify(params)
    ],

    queryFn: async () => {

      const { data } = await axiosInstance.get(
        `${url}/${id}`,
        {
          params: {
            payload: encrypt(params)
          }
        }
      );

      return handleRes(data);
    },

    enabled: !!id && (options.enabled ?? true),

    ...options,

    keepPreviousData: true,
  });
};

// =======================
// POST / PUT / DELETE
// =======================
export const useApiMutation = (
  url,
  method = "post",
  invalidateKeys = [],
  encryptPayload = true
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {

      // ✅ Check FormData
      const isFormData = payload instanceof FormData;
      const finalUrl = (method.toLowerCase() === 'delete' && (typeof payload === 'string' || typeof payload === 'number'))
        ? `${url}/${payload}`
        : url;

      let finalData;
      if (isFormData) {
        finalData = payload;
      } else if (payload) {
        finalData = encryptPayload ? { payload: encrypt(payload) } : payload;
      } else {
        finalData = undefined;
      }

      const res = await axiosInstance({
        url: finalUrl,
        method,

        data: finalData,

        // ✅ multipart only for FormData
        headers: isFormData
          ? {
            "Content-Type": "multipart/form-data",
          }
          : {
            "Content-Type": "application/json",
          },
      });

      return handleRes(res.data);
    },

    onSuccess: (data) => {
      invalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({
          queryKey: [key],
        });
      });

      toast.success(data?.message || "Success");

      return handleRes(data);
    },

    onError: (err) => {
      const encryptedError = err?.response?.data?.eresponse;
      let message = "Something went wrong";

      if (typeof encryptedError === "string" && encryptedError.trim()) {
        const decryptedError = decrypt(encryptedError);
        if (decryptedError?.message) {
          message = decryptedError.message;
        }
      } else if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        message = err.message;
      }

      toast.error(message);
    },
  });
};