import { decryptData } from "@/utils";
import { getCookie } from "cookies-next";

export function useDecryptCredentials() {
  const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
  const encryptedEmail = getCookie("email");
  const encryptedPassword = getCookie("password");

  if (encryptedEmail !== null && encryptedPassword !== null) {
    const email = decryptData(encryptedEmail, secretKey as string);
    const password = decryptData(encryptedPassword, secretKey as string);
    return { email, password, secretKey };
  } else {
    console.warn("Email and password are not set in Cookies");
    return { email: "", password: "" };
  }
}
