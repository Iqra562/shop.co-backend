
import nodemailer from 'nodemailer'
function createOtpEmail(userEmail, otp, expiryMinutes = 5) {
    return {
        from: `Shop.co <shop.co@gmail.com>`,
        to: userEmail,
        subject: "Your OTP Code - Shop.co",
        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2 style="color: #333;">Verify Your Email</h2>
        <p>Hi there,</p>
        <p>Use the following <strong>OTP code</strong> to verify your email address:</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${otp}</p>
        <p>This OTP will expire in 5 minutes: <strong>${expiryMinutes} minutes</strong>.</p>
        <hr>
        <p style="font-size: 12px; color: #888;">If you did not request this, please ignore this email.</p>
      </div>
    `,
    };
}

export async function sendVerificationMail(userEmail, otp, expiryMinutes) {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: 'iqra44938@gmail.com',
            pass: process.env.GOOGLE_PASSKEYS,

        },
    });


    const mailOptions = createOtpEmail(userEmail, otp, expiryMinutes);

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error("Error sending OTP:", err);
        } else {
            console.log("OTP sent:", info.response);
        }
    });

}