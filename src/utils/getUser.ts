// get user and token from local storage
export const getUser = () => {
  // localStorage is not defined on the server side (e.g., during SSR in Next.js)
  // So we need to check if 'window' is defined before accessing localStorage
  const user =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return { user: user ? JSON.parse(user) : null, token: token || null };
};
