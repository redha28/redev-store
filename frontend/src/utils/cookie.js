import Cookies from "js-cookie";

// Set cookie with expiration in days
export const setCookie = (name, value, days = 7) => {
  return Cookies.set(name, value, { expires: days });
};

// Get cookie value
export const getCookie = (name) => {
  return Cookies.get(name);
};

// Remove cookie
export const removeCookie = (name) => {
  return Cookies.remove(name);
};

// Check if cookie exists
export const hasCookie = (name) => {
  return !!getCookie(name);
};
