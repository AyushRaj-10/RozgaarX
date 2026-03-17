import { sendEmail } from "../provider/sendEmail.js";
import logger from "../utils/logger.js";

export const sendApplicationEmail = async (application) => {

  const { userId, jobId, email } = application;

  const subject = "New Job Application";
  const body = `User ${userId} applied for job ${jobId}`;

  await sendEmail(email, subject, body);

  logger.info(`Application email sent to ${email} for job ${jobId}`);
};

export const sendAuthEmail = async (user) => {

  const { email } = user;

  const subject = "Welcome";
  const body = `Hello ${email}, welcome to our website!`;

  await sendEmail(email, subject, body);

  logger.info(`Welcome email sent to ${email}`);
};

export const sendJobEmail = async (job) => {

  const { title, email } = job;

  const subject = "New Job Created";
  const body = `A new job titled ${title} has been created. Check it out!`;

  await sendEmail(email, subject, body);

  logger.info(`Job notification email sent for job ${title} to ${email}`);
};