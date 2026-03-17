import { sendJobEmail } from "../services/notifiactionService.js";

export const handleJobCreated = async (job) => {        
    try {
        await sendJobEmail(job);
    } catch (error) {
        console.error(error)
    }
}   