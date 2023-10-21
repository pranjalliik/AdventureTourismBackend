
const nodemailer = require('nodemailer')

const sendMail = async options =>{

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        auth: {
            user:process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD
        }
    })

    const mailoptions = {
        from: 'pranjali <2bebe8d866-ed757b+1@inbox.mailtrap.io>',
        to:options.email,
        subject:options.subject,
        text:options.message
    }
    await transporter.sendMail(mailoptions)
}

module.exports = sendMail