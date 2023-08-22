/* eslint-disable no-undef */
import nodemailer from 'nodemailer';
import { generateResetToken } from '../../utils/resetpasswordToken';

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

    // Generate reset token
    const resetToken = generateResetToken(userData.email);

    const urlLinks = 'https://wishbin-store.vercel.app';

    // set email options
    const mailOptions = {
      from: transport.sender,
      to: userData.email, // to: "receiver@gmail.com",
      subject: "Forget password of WishBin-store app",
      text: 'Forget password of WishBin-store',
      html: `
            <body style="background-color: #f2f2f2; padding: 40px 35px; max-width: 600px; margin: auto;">
            <center
              style="display: block; height: 100%; width: 100%;"
            >
              <!-- logo -->
              <table>
                <a href="https://wishbin-store.vercel.app/">
                  <img
                    src="https://i.ibb.co/cLH47qV/logo.png"
                    alt="Head-Icons"
                    style="width: 80px; height: 80px; object-fit: contain; border-radius: 50%; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);"
                  />
                </a>
              </table>
              <!-- contents -->
              <table
                style="display: block; width: 100%; max-height: 100%; padding:20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); margin-top: 20px;"
              >
                <!-- title -->
                <h1
                  style="text-align: center; font-size: 28px; color: #000000; margin-bottom: 29px;"
                >
                  You have requested to reset your password
                </h1>
                <!-- text -->
                <p
                  style="text-align: center; font-size: 16px; color: #455056; margin-bottom: 35px; line-height:26px;"
                >
                  We cannot simply send you your old password. A unique link to reset
                  your password has been generated for a 5 minutes after time complete to need to regenerate a email. To reset your password,
                  click the following link and follow the instructions.
                </p>
                <!-- reset button -->
                <a
                  class="uppercase"
                  style="margin:0 auto; display: flex; width: fit-content; border-radius: 50px; padding: 12px 24px; background: #f16565; color: #fff; font-weight: 500; font-size: 16px; letter-spacing: 0.4px; text-decoration: none; "
                  href="`+ urlLinks + `/resetPassword?token=` + resetToken + `"
                >
                  Reset Your Password
                </a>
              </table>
              <a
              href="`+ urlLinks + `"
                style="margin-top: 15px; display:block; font-size: 16px; color: rgba(69, 80, 86, 0.7411764705882353); line-height: 18px; margin-bottom: 0;"
              >
                &copy; <strong>www.wishBin-store.com</strong>
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

    res.setHeader('Set-Cookie', `resetpassword=${resetToken}; HttpOnly: Max-Age=300; Path=/resetPassword`);
    res.status(200).json({ message: 'Email sent successfully' });
  } else {
    res.status(405).end('Method Not Allowed');
  }

}