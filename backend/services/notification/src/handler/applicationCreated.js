import { sendApplicationEmail } from "../services/notifiactionService.js";

export const handleApplicationCreated = async (application) => {

    try {
        await sendApplicationEmail(application);
    } catch (error) {
        console.error(error)
    }
}