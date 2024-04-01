import { createContext } from "react";

const Auth = createContext({
  token: "",
  isLoggedIn: false,
  expirationTime: "",
});

export default Auth;
