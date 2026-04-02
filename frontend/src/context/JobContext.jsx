import { createContext, useState, useContext } from "react";
import axios from "axios";
import { userContext } from "./UserContext";

export const JobContext = createContext();

const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:8084";

export const JobProvider = ({ children }) => {
  const { isRecruiter, token, user } = useContext(userContext);

  const createJob = async (formdata) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(`${url}/jobs`, formdata, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error creating job:", error.response?.data || error.message);
    return null;
  }
};

  const getJobs = async (pageNumber) => {
    try {
         const token = localStorage.getItem("token");
      const res = await axios.get(`${url}/jobs?page=${pageNumber}`,{
        headers : {
            Authorization: `Bearer ${token}`  
        }
    }
      );
      const data = res.data;
      console.log(data);
      return data;
    } catch (error) {
      console.log("Error fetching jobs");
    }
  };

  const getJobById = async (id) => {
    try {
         const token = localStorage.getItem("token");
      const res = await axios.get(`${url}/jobs/${id}`,{
        headers : {
            Authorization: `Bearer ${token}`  
        }
    }
      );
      const data = res.data;
      console.log(data);
      return data;
    } catch (error) {
      console.log("Error fetching job by id");
    }
  };

  const updateJob = async (id, formdata) => {
    try {
         const token = localStorage.getItem("token");
      const res = await axios.put(`${url}/jobs/${id}`, formdata, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data;
      console.log(data);
      return data;
    } catch (error) {
      console.log("Error updating job");
    }
  };

  const deleteJob = async (id) => {
    try {
         const token = localStorage.getItem("token");
      const res = await axios.delete(`${url}/jobs/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data;
      console.log(data);
      return data;
    } catch (error) {
      console.log("Error deleting job");
    }
  };

  const getJobByKeyword = async (keyword) => {
    try {
         const token = localStorage.getItem("token");
      const res = await axios.get(`${url}/jobs/search?keyword=${keyword}`,{
        headers : {
            Authorization: `Bearer ${token}`  
        }
    }
      );
      const data = res.data;
      console.log(data);
      return data;
    } catch (error) {
      console.log("Error searching jobs");
    }
  }

  return (
    <JobContext.Provider value={{ 
        createJob,
        getJobs,
        getJobById,
        updateJob,
        deleteJob,
        getJobByKeyword,
        isRecruiter,
        user    
     }}>{children}</JobContext.Provider>
  );
};
