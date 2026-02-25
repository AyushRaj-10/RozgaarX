import { createUserProfile , getUserProfileByAuthId , updateUserProfile , deleteUserProfile} from "../models/user.models.js";
import axios from "axios";

export const createUser = async (req, res) => {
    try {
        const user = await createUserProfile(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const user = await getUserProfileByAuthId(req.params.auth_id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateUser = async (req, res) => {
    try {
        const user = await updateUserProfile(req.params.auth_id, req.body);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const user = await deleteUserProfile(req.params.auth_id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

