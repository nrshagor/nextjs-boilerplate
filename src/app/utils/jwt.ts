// src/utils/jwt.ts
import { jwtDecode } from "jwt-decode";
import { getCookie } from "cookie-handler-pro";

export interface DecodedToken {
  sub: number;
  email: string;
  role: string;
  phone: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  iat: number;
  exp: number;
  [key: string]: any;
}

export const auth = (): DecodedToken | null => {
  const cookieToken = getCookie("token");
  if (cookieToken) {
    try {
      const decoded = jwtDecode<DecodedToken>(cookieToken);
      return decoded;
    } catch (error) {
      console.error("Invalid token", error);
    }
  } else {
    console.error("No token found");
  }
  return null;
};
