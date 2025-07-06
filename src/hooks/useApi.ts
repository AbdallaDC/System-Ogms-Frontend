"use client";
import useSWR, { mutate } from "swr";
import axios from "axios";

import { API_BASE_URL } from "@/lib/config";

// Helper function to get token from localStorage
const getToken = () => {
  return typeof window !== "undefined" ? localStorage.getItem("token") : "";
};

// Axios configuration with dynamic token
const getAxiosConfig = () => {
  const token = getToken(); // Retrieve token from localStorage
  return token
    ? {
        headers: {
          Authorization: `Token ${token}`, // Add token to Authorization header
        },
      }
    : {};
};

// GET fetcher
const fetcher = (url: string) =>
  axios.get(url, getAxiosConfig()).then((res) => res.data);

// GET hook
export const useFetch = <T>(endpoint: string, params?: Record<string, any>) => {
  const queryString = params
    ? `?${new URLSearchParams(params).toString()}`
    : "";
  const { data, error, isValidating, mutate } = useSWR<T>(
    `${API_BASE_URL}${endpoint}${queryString}`,
    fetcher,
    { revalidateOnFocus: false, shouldRetryOnError: true }
  );
  return { data, error, isLoading: isValidating, mutate };
};

// Mutation hooks: POST, PUT, DELETE with automatic revalidation

export const usePost = <TRequest, TResponse>(
  postEndpoint: string,
  getEndpointToRevalidate?: string
) => {
  try {
  } catch (error) {
    console.error("Error in usePost hook:", error);
    throw error; // Re-throw the error for further handling if needed
  }
  const postData = async (data: TRequest): Promise<TResponse | undefined> => {
    const response = await axios.post(
      `${API_BASE_URL}${postEndpoint}`,
      data,
      getAxiosConfig()
    );
    if (getEndpointToRevalidate) {
      mutate(`${API_BASE_URL}${getEndpointToRevalidate}`);
    }

    return response.data;
  };

  return { postData };
};

export const usePut = <TRequest, TResponse>(
  putEndpoint: string,
  getEndpointToRevalidate?: string
) => {
  const putData = async (data: TRequest): Promise<TResponse> => {
    const response = await axios.put(
      `${API_BASE_URL}${putEndpoint}`,
      data,
      getAxiosConfig()
    );
    if (getEndpointToRevalidate) {
      mutate(`${API_BASE_URL}${getEndpointToRevalidate}`);
    }
    return response.data;
  };

  return { putData };
};

export const useDelete = <TResponse>(
  deleteEndpoint: string,
  getEndpointToRevalidate?: string
) => {
  const deleteData = async (
    id: string,
    endpointBase: string
  ): Promise<TResponse> => {
    const url = `${API_BASE_URL}${endpointBase}/${id}`;

    const response = await axios.delete(url, getAxiosConfig());

    if (getEndpointToRevalidate) {
      mutate(`${API_BASE_URL}${getEndpointToRevalidate}`);
    }

    return response.data;
  };

  return { deleteData };
};
