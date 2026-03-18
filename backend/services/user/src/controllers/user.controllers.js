import {
  createUserProfile,
  getUserProfileByAuthId,
  updateUserProfile,
  deleteUserProfile,
} from "../models/user.models.js";
import redisClient from "../config/redis.js";
import logger from "../utils/logger.js";

export const createUser = async (req, res) => {
  try {
    const user = await createUserProfile(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const cacheKey = `user:${req.params.auth_id}`;
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      logger.info("Cache hit");
      return res.json(JSON.parse(cached));
    }

    logger.info("Cache Miss");

    const user = await getUserProfileByAuthId(req.params.auth_id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await redisClient.set(cacheKey, JSON.stringify(user), {
      EX: 60 * 30 ,
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
};

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
};
