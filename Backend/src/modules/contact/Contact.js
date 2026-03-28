import sendAdminNotification from "../services/telegram.service.js";

export const submitContactForm = async (req, res) => {
    try {
        console.log("CONTACT US FORM API CALLED");
        const { firstName,lastName,email,phoneNo,message } = req.body;

        if(!firstName || !lastName || !email || !phoneNo || !message){
            return res.status(400).json({
                success:false,
                message:"Please Fulfill all required Details"
            })
        }

        const telegramMessage = `
<b>🚨 NEW CONTACT ALERT</b>

👤 <b>Name:</b> ${firstName} ${lastName}
📧 <b>Email:</b> ${email}
🔭 <b>Email:</b> ${phoneNo}
📝 <b>Message:</b>
${message}
⏰ <b>Time:</b> ${new Date().toLocaleString()}
`;
        await sendAdminNotification(telegramMessage);

        res.status(200).json({ success: true, message: "Message sent successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
