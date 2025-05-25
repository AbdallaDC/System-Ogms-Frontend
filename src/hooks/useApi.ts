import useSWR, { mutate } from "swr";
import axios from "axios";

const API_BASE_URL = "https://online-garage-backend.onrender.com";

// Helper function to get token from localStorage
const getToken = () => {
  return localStorage.getItem("token");
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
  const { data, error, isValidating } = useSWR<T>(
    `${API_BASE_URL}${endpoint}${queryString}`,
    fetcher,
    { revalidateOnFocus: true, shouldRetryOnError: true }
  );
  return { data, error, isLoading: isValidating };
};

// Mutation hooks: POST, PUT, DELETE with automatic revalidation

export const usePost = <TRequest, TResponse>(
  postEndpoint: string,
  getEndpointToRevalidate?: string
) => {
  const postData = async (data: TRequest): Promise<TResponse> => {
    const response = await axios.post(`${API_BASE_URL}${postEndpoint}`, data);
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
    const response = await axios.put(`${API_BASE_URL}${putEndpoint}`, data);
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
  const deleteData = async (): Promise<TResponse> => {
    const response = await axios.delete(`${API_BASE_URL}${deleteEndpoint}`);
    if (getEndpointToRevalidate) {
      mutate(`${API_BASE_URL}${getEndpointToRevalidate}`);
    }
    return response.data;
  };

  return { deleteData };
};
