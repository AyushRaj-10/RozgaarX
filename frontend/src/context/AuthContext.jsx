import { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:8084";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  // ✅ REGISTER
  const createUser = async (formData) => {
    try {
      const res = await axios.post(
        `${url}/auth/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = res.data;

      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);

      return data;
    } catch (error) {
  console.error(
    "REGISTER ERROR:",
    error.response?.data || error.message
  );

  return null; 
}
  };

  // ✅ LOGIN
  const loginUser = async (email, password) => {
    try {
      const res = await axios.post(
        `${url}/auth/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = res.data;

      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);

      // if backend sends token
      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
      }

      return data;
    } catch (error) {
      console.error("Error logging in", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        createUser,
        loginUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;