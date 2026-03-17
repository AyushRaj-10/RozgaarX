import { sendAuthEmail } from "../services/notifiactionService.js";

export const handleUserCreated = async (user) => {  
    try {
        await sendAuthEmail(user);
    } catch (error) {
        console.error(error)
    }
}