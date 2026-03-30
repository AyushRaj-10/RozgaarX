import { createContext, useState } from "react";
import axios from "axios";

export const userContext = createContext();

const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:8084";

export const UserProvider = ({ children }) => {

    const createUserData = async (formData) => {
        try {
            const token = localStorage.getItem("token");
            console.log("TOKEN FROM STORAGE:", token);
            const res = await axios.post(`${url}/users`, formData, { 
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            console.log(token)
            const data = res.data;
            console.log(data);
            return data;
        } catch (error) {
            console.log("Error creating User");
        }
    }

    const getUserProfile = async (id) => {
        try {
            const res = await axios.get(`${url}/users/${id}`);
            const data = res.data;
            console.log(data);
            return data;
        } catch (error) {
            console.log("Error getting user Profile");
        }
    }

    const updateUserProfile = async (id, formData) => {
        try {
            const token = localStorage.getItem("token");
            console.log(token)
            const res = await axios.put(`${url}/users/${id}`, formData, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
           
            const data = res.data;
            console.log(data);
            return data;
        } catch (error) {
            console.log("Error updating user Profile");
        }
    }

    const deleteUser = async (id) => {
        try {
            const res = await axios.delete(`${url}/users/${id}`);
            const data = res.data;
            console.log(data);
            return data;
        } catch (error) {
            console.log("Error deleting user");
        }
    }

    return (
        <userContext.Provider
            value={{
                createUserData,   
                getUserProfile,   
                updateUserProfile, 
                deleteUser        
            }}
        >
            {children}
        </userContext.Provider>
    );
}