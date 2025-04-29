import { User } from "@/models/user.model";
import nodemailer from 'nodemailer'


interface mailValidatorProps {
    email: string,
    emailType: string,
}

export async function mailValidator({ email, emailType }: mailValidatorProps) {
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

        if (emailType === "verifyEmail") {
            await User.findOneAndUpdate(
                {
                    email
                },
                {
                    $set: {
                        emailVerificationOTP: validationOTP,
                        emailVerificationOTPexpiry: Date.now() + 3600000
                    }
                },
                {
                    returnDocument: 'after'
                }
            );
        }


        const transport = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_USER_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: emailType === "forgotPassword" ? "OTP to Reset Your Password" : "Verify your credentials",
            html: `<p>
            ${emailType === "verifyEmail" ? `Your 4 digit code to reset the password ${validationOTP}` : `Your 4 digit code to verify credentials ${validationOTP}`}
            </p>`
        }

        try {

            const mailResponse = await transport.sendMail(mailOptions);
            console.log(mailResponse);
            return mailResponse;

        } catch (error) {
            console.error("Error sending Mail : ", error)
        }



    } catch (error: any) {
        throw new Error("Error validating with the mail", error.message)
    }
}