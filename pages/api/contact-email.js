/* eslint-disable no-undef */
import moment from 'moment/moment';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {

    if (req.method === 'POST') {
        const { userData } = req.body;

        // Create reuseable transporter object using SMTP transport
        const transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: {
                user: process.env.BUSINESS_EMAIL,
                pass: process.env.BUSINESS_PASS
            },
            sender: '"WishBin-store" <no-reply@example.com>'
        });

        const urlLinks = 'http://localhost:3000';

        const date = moment().format("MMM Do YY");

        // set email options
        const mailOptions = {
            from: transport.sender,
            to: userData.email, // to: "receiver@gmail.com",
            cc: process.env.BUSINESS_EMAIL,
            subject: "WishBin-store Contact",
            text: 'Thank you for contact at WishBin-store',
            html: `
            <body style="background-color: #f2f2f2; padding: 40px 35px; max-width: 600px; margin: auto; height:100%;">
            <center style="display: block; height: 100%; width: 100%;">
                <!-- logo -->
                <table>
                    <a href="http://localhost:3000">
                        <img src="https://i.ibb.co/bgV14jM/Head-Icons.png" alt="Head-Icons"
                            style="width: 80px; height: 80px; object-fit: contain; border-radius: 50%; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);" />
                    </a>
                </table>
                <!-- contents -->
                <table
                    style="display: block; width: 100%; height: max-content; padding:20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); margin-top: 20px;">
                    <!-- title -->
                    <h1 style="text-align: center; font-size: 28px; color: #000000; margin-bottom: 29px;">
                        Thank you for Contact us
                    </h1>
                    <!-- text -->
                    <p style="font-size: 16px; color:#000000; text-align:left; margin-bottom:10px;">
                        Date: `+ date + `
                    </p>

                    <p style="font-size: 16px; color:#000000; text-align:left; margin-bottom:10px;">
                        Name: `+ userData.username + `
                    </p>
        
                    <p style="font-size: 16px; color:#000000; text-align:left; margin-bottom:10px;">
                        Email: `+ userData.email + `
                    </p>
        
                    <p style="font-size: 16px; color:#000000; text-align:left; margin-bottom:10px;">
                        Message: `+ userData.message + `
                    </p>
        
                    <p style="font-size: 16px; color:#000000; text-align:left; margin-bottom:10px;">
                        Dear, `+ userData.username + `,
                    </p>
        
                    <p style="font-size: 16px; color:#000000; text-align:left; margin-bottom:10px;">
                        I hope this email finds you well. I wanted to let you know that I received your inquiry from `+ date + ` and
                        our team has been looking into your request regarding queries.
                    </p>
        
                    <p style="font-size: 16px; color:#000000; text-align:left; margin-bottom:10px;">
                        I appreciate you taking the time to reach out to us. We are working to get you an answer/solution as
                        quickly as possible. Please expect a follow up response from us by 2/3 working days.
                    </p>
        
                    <p style="font-size: 16px; color:#000000; text-align:left; margin-bottom:10px;">
                        In the meantime, please let me know if you have any other questions or need anything else from our team.
                        We are happy to assist. Thank you for your patience as we work to resolve this for you.
                    </p>
        
                    <p style="font-size: 16px; color:#000000; text-align:left; margin-bottom:10px;">
                        Best regards, <br />
                        `+ userData.username + ` <br />
                        `+ userData.email + ` <br />
                    </p>
                </table>
                <a href="`+ urlLinks + `"
                    style="margin-top: 15px; display:block; font-size: 16px; color: rgba(69, 80, 86, 0.7411764705882353); line-height: 18px; margin-bottom: 0;">
                    &copy; <strong>www.wishbin-store.com</strong>
                </a>
            </center>
        </body>
            `,
        };

        // eslint-disable-next-line no-unused-vars
        transport.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Email sent successfully...!");

            }
        });

        res.status(200).json({ message: 'Email sent successfully' });
    } else {
        res.status(405).end('Method Not Allowed');
    }

}