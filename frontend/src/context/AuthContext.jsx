import { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:8084";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null,
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // ✅ FIX: Read isRecruiter from localStorage so it survives page refresh
  const [isRecruiter, setIsRecruiter] = useState(
    localStorage.getItem("isRecruiter") === "true",
  );

  // ✅ REGISTER
  const createUser = async (formData) => {
    try {
      const res = await axios.post(`${url}/auth/register`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      const data = res.data;
      console.log(data);

      localStorage.setItem("user", JSON.stringify(data.user ?? data));
      // ✅ FIX: use data.user?.id or data.id — not user.id (state not set yet)
      localStorage.setItem("authId", data.user?.id ?? data.id ?? "");
      setUser(data.user ?? data);

      localStorage.setItem("token", data.token);
      setToken(data.token);

      const recruiterFlag = data.user?.role === "recruiter";
      localStorage.setItem("isRecruiter", recruiterFlag);
      setIsRecruiter(recruiterFlag);

      return data;
    } catch (error) {
      console.error("REGISTER ERROR:", error.response?.data || error.message);
      return null;
    }
  };

  // ✅ LOGIN
  const loginUser = async (email, password) => {
    console.log("➡️ login() called with email:", email);
    try {
      const res = await axios.post(
        `${url}/auth/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } },
      );

      const data = res.data;
      console.log("✅ Login API response:", data);

      if (data.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        // ✅ FIX: use data.user.id — not user.id (stale state reference)
        localStorage.setItem("authId", data.user.id ?? "");
        localStorage.setItem("token", data.token);
        setToken(data.token);

        const recruiterFlag = data.user.role === "recruiter";
        localStorage.setItem("isRecruiter", recruiterFlag);
        setIsRecruiter(recruiterFlag);
      } else {
        setUser({ email });
      }

      return data;
    } catch (err) {
      console.error("❌ Login error:", err.response?.data || err.message);
      throw err;
    } finally {
      console.log("⏹ login() finished");
    }
  };

  // ✅ FIX: axiox → axios typo fixed; also clear isRecruiter on logout
  const logout = async () => {
    try {
      await axios.post(`${url}/auth/logout`);
    } catch (error) {
      // Logout locally even if server call fails
      console.warn("Logout API failed, clearing session locally.");
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("authId");
      localStorage.removeItem("isRecruiter");
      setUser(null);
      setToken(null);
      setIsRecruiter(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        isRecruiter,   
        logout,        
        createUser,
        loginUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;