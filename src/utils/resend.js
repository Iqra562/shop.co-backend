import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async(userEmail, otp, expiryMinutes )=>{
    try{

        const {data,error} = await resend.emails.send({
from: "Shop.co <onboarding@resend.dev>",
            to :[userEmail],
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
      
    })
    return {data,error};
}catch(error){
            throw new ApiError(500, "Something went wrong while sending otp")
 
}
}