import redisClient from "../config/redis.js";

export const rateLimiter = async(req,res,next) => {
    try {
        const key = `rate:${req.ip}`;
        const request = await redisClient.incr(key);

        if(request == 1){
            await redisClient.expire(key, 60);
        }

        if(request > 20){
            return res.status(429).json({message : "Too Many Requests"});
        }

        next();
        
    } catch (error) {
        console.log("Rate Limiter Error :", error);
        res.status(500).json({error : "Internal Server Error"});
        next();
    }

}

