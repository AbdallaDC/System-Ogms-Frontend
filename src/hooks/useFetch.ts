// /* eslint-disable @typescript-eslint/no-explicit-any */
// import useSWR from "swr";

// // const API_BASE_URL =
// //   process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
// const API_BASE_URL = "https://online-garage-backend.onrender.com";

// // Function to convert object to query string
// const buildQueryString = (params?: Record<string, any>) => {
//   if (!params) return "";
//   const query = new URLSearchParams(params).toString();
//   return query ? `?${query}` : "";
// };

// const fetcher = async (url: string) => {
//   const response = await fetch(url);
//   if (!response.ok) throw new Error("Failed to fetch data");
//   return response.json();
// };

// const useFetch = <T>(endpoint: string, params?: Record<string, any>) => {
//   const queryString = buildQueryString(params);
//   const { data, error, isValidating } = useSWR<T>(
//     `${API_BASE_URL}${endpoint}${queryString}`,
//     fetcher,
//     {
//       revalidateOnFocus: true,
//       shouldRetryOnError: true,
//     }
//   );

//   return { data, error, isLoading: isValidating };
// };

// export default useFetch;
