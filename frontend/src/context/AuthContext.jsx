import { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:8084";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null,
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isRecruiter, setisRecruiter] = useState(false);

  // ✅ REGISTER
  const createUser = async (formData) => {
    try {
      const res = await axios.post(`${url}/auth/register`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = res.data;
      console.log(data);

      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);

      return data;
    } catch (error) {
      console.error("REGISTER ERROR:", error.response?.data || error.message);

      return null;
    }
  };

  // ✅ LOGIN
  const loginUser = async (email, password) => {
    console.log("➡️ login() called with email:", email);
    alert("THIS VERSION IS RUNNING");
    try {
      const res = await axios.post(
        `${url}/auth/login`,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      const data = res.data;

      console.log("✅ Login API response:", data);

      if (data.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        setUser({ email });
      }

      return data;
    } catch (err) {
      const msg = err.response?.data?.message || "❌ Login failed";
      console.error("❌ Login error:", err.response?.data || err.message);
      throw err;
    } finally {
      console.log("⏹ login() finished");
    }
  };

  const logout = async () => {
    try {
      const res = await axiox.post(`${url}/auth/logout`);
      console.log("Logging Out");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
    } catch (error) {}
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
