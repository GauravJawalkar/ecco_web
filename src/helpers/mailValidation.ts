import { User } from "@/models/user.model";
import nodemailer from 'nodemailer'


interface mailValidatorProps {
    email: string,
    emailType: string,
    userId: string
}

export async function mailValidator({ email, emailType, userId }: mailValidatorProps) {
    try {

        const validationOTP = Math.floor(Math.random() * 9000 + 1000);

        if (email.trim() === "") {
            return new Error("Email is required!");
        }

        if (emailType === "forgotPassword") {
            await User.findOneAndUpdate(
                {
                    email
                },
                {
                    $set: {
                        forgotPasswordOTP: validationOTP,
                        forgotPasswordOTPexpiry: Date.now() + 3600000
                    }
                },
                {
                    returnDocument: 'after'
                }
            );
        }


        const transport = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 2525,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_USER_PASSWORD
            }
        });

        const mailOptions = {
            from: 'gauravjawalkar8@gmail.com',
            to: email,
            subject: emailType === "forgotPassword" ? "OTP to Reset Your Password" : "Verify your credentials",
            html: `<p>
            ${emailType === "forgotPassword" ? `Your 4 digit code to reset the password ${validationOTP}` : "Nothing"}
            </p>`
        }

        const mailResponse = await transport.sendMail(mailOptions);

        return mailResponse;


    } catch (error: any) {
        throw new Error("Error validating with the mail", error.message)
    }
}