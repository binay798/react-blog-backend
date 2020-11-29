const nodemailer = require('nodemailer')

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })
        const mailOptions = {
            from: 'Binay shrestha <binay@gmail.com>',
            to: options.email,
            subject: 'Reset password',
            text: options.message
        }
    
        await transporter.sendMail(mailOptions)
    } catch(err) {
        return new Error('Problem occured while sending email')
    }
    
    
}

module.exports = sendEmail