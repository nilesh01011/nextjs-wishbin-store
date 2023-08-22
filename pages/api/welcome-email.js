/* eslint-disable no-undef */
import nodemailer from 'nodemailer';

export default async function handler(req, res) {

    if (req.method === 'POST') {
        const { userEmail } = req.body;

        console.log(userEmail)

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

        // set email options
        const mailOptions = {
            from: transport.sender,
            to: userEmail, // to: "receiver@gmail.com",
            subject: "Welcome to WishBin-store app",
            text: 'Welcome to WishBin-store',
            html:
                `<body
                    style="background-color: #f2f2f2; padding: 26px; max-width: 600px; margin: auto; font-family: 'Poppins', sans-serif;">
                    <center style="display: block; height: 100%; width: 100%;">
                        <!-- logo -->
                        <table width="100%" border="0" cellspacing="0" style="padding-left:35px; padding-right:35px; padding-top:20px; background-color:#E7EDEF;">
                            <tr>
                                <td align="center">
                                    <a href="https://ibb.co/FVMRjpC"><img src="https://i.ibb.co/cLH47qV/logo.png" alt="logo" border="0"
                                        style="width: 100px; height: 100px; object-fit: contain; border-radius: 50%; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);"></a>
                                </td>
                            </tr>
                        </table>
                        <!-- title -->
                        <table width="100%" border="0" cellspacing="0" style=" padding-top:20px; padding-left:35px; padding-right:35px; background-color:#E7EDEF;">
                            <tr>
                                <td>
                                    <!-- title -->
                                    <h1 style="text-align: center; font-size: 28px; color: #000000; margin-bottom: 16px; margin-top: 0;">
                                        Hey, AwesomeCo!
                                    </h1>
                                </td>
                            </tr>
                        </table>
                        <!-- subtitle -->
                        <table width="100%" border="0" cellspacing="0" style="padding-left:35px; padding-right:35px; background-color:#E7EDEF;">
                            <tr>
                                <td>
                                    <p style="text-align: center; font-size: 16px; font-weight:600; margin-top:0; margin-bottom:18px; color: #455056; line-height:26px;">
                                        Welcome to Wishbin-store <br />
                                        We are so happy to have you here!
                                    </p>
                                </td>
                            </tr>
                        </table>
                        <!-- images -->
                        <table width="100%" border="0" cellspacing="0" style="padding-left:16px; padding-right:16px; background-color:#E7EDEF;">
                            <tr>
                                <td align="center">
                                    <img src="https://i.ibb.co/mF30Wv5/Registers-BGImages.png" style="width:100%; height:300px; object-fit:contain;" alt="Registers-BGImages"
                                        border="0">
                                </td>
                            </tr>
                        </table>

                        <!-- button -->
                        <table width="100%" border="0" cellspacing="0" style="padding-left:35px; padding-right:35px; padding-top:18px; padding-bottom:20px; background-color:#E7EDEF;">
                            <tr>
                                <td>
                                    <a class="uppercase"
                                        style="margin:0 auto; display: flex; width: fit-content; border-radius: 5px; padding: 14px 36px; background: #f16565; color: #fff; font-weight: 500; font-size: 16px; letter-spacing: 0.4px; text-decoration: none; "
                                        href="http://localhost:3000/userProfile" target="_blank">
                                        Go to your account
                                    </a>
                                </td>
                            </tr>
                        </table>

                        <table width="100%" border="0" cellspacing="0">
                            <tr>
                                <td align='center'>
                                    <a href="`+ urlLinks + `"
                                        style="margin-top: 15px; display:block; font-size: 16px; color: rgba(69, 80, 86, 0.7411764705882353); line-height: 18px; margin-bottom: 0;">
                                        &copy; <strong>www.wishbin-store.com</strong>
                                    </a>
                                </td>
                            </tr>
                        </table>
                    </center>
                </body>`
            ,
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