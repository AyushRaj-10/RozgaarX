import { createContext, useState } from "react";
import axios from 'axios';

export const ApplicationContext = createContext();

const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:8084";

export const ApplicationProvider = ({ children }) => {

    const applyToJob = async (formData) => {
        try {
            const token = localStorage.getItem("token");
            console.log(token)
            const res = await axios.post(`${url}/applications`, formData, { 
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = res.data;
            console.log(data);
            return data;
        } catch (error) {
            console.log("Error applying to job");
        }
    }

    const getApplicationsByUserId = async (userId) => {
        try {
            const res = await axios.get(`${url}/applications?userId=${userId}`);
            const data = res.data;
            console.log(data);
            return data;
        }           catch (error) { 
            console.log("Error getting applications");
        }
    }

    const getApplicationsByJobId = async (jobId) => {
        try {
            const res = await axios.get(`${url}/applications?jobId=${jobId}`);
            const data = res.data;
            console.log(data);
            return data;
        } catch (error) {
            console.log("Error getting applications");
        }
    }

    const getApplicationForUserAndJob = async (userId, jobId) => {
        try {
            const res = await axios.get(`${url}/applications?userId=${userId}&jobId=${jobId}`);
            const data = res.data;
            console.log(data);
            return data;
        } catch (error) {
            console.log("Error getting application for user and job");
        }
    }       

    const updateApplicationStatus = async (applicationId, status) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.put(`${url}/applications/${applicationId}`, { status }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = res.data;
            console.log(data);
            return data;
        } catch (error) {
            console.log("Error updating application status");
        }
    }

    return (
        <ApplicationContext.Provider value={{ applyToJob, getApplicationsByUserId, getApplicationsByJobId, getApplicationForUserAndJob, updateApplicationStatus }}>
            {children}
        </ApplicationContext.Provider>
    )
}

export default ApplicationContext;  