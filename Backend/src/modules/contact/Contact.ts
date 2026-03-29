import { ApiResponse } from "../../shared/lib/ApiResponse.js";
import { AppError } from "../../shared/lib/AppError.js";
import { asyncHandler } from "../../shared/lib/asyncHandler.js";
import { sendAdminNotification } from "../../shared/services/telegram.service.js";
import type { Handler } from "../../shared/types.js";

export const submitContactForm: Handler = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, phoneNo, message } = req.body;

  if (!firstname || !lastname || !email || !phoneNo || !message) {
    throw AppError.badRequest("All fields are required");
  }

  const telegramMessage = `
<b>🚨 NEW CONTACT ALERT</b>

👤 <b>Name:</b> ${firstname} ${lastname}
📧 <b>Email:</b> ${email}
🔭 <b>Phone:</b> ${phoneNo}
📝 <b>Message:</b>
${message}
⏰ <b>Time:</b> ${new Date().toLocaleString()}
`;
  await sendAdminNotification(telegramMessage);

  ApiResponse.success(res, {}, "Message sent successfully");
});
