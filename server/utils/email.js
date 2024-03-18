
const nodemailer = require('nodemailer')

/*const sendMail = async options =>{

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
*/

module.exports = class Email {
    constructor(user, url) {
      this.to = user.email;
      this.firstName = user.name.split(' ')[0];
      this.url = url;
      this.from = 'pranjali <2bebe8d866-ed757b+1@inbox.mailtrap.io>';
    }
  
    newTransport() {
    /*  if (process.env.NODE_ENV === 'production') {
        // Sendgrid
        return nodemailer.createTransport({
          service: 'SendGrid',
          auth: {
            user: process.env.SENDGRID_USERNAME,
            pass: process.env.SENDGRID_PASSWORD
          }
        });
      }*/
  
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      });
    }
  
    // Send the actual email
    async send(template, subject) {
      // 1) Render HTML based on a pug template
   
  
      let {resetPass} = require('./emailContent.js')
 //     console.log(resetPass)

      const emailBody = resetPass(this.firstName,this.url);
      console.log(emailBody)
       
      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        text: emailBody
      };  
  
      // 3) Create a transport and send email
      await this.newTransport().sendMail(mailOptions);
    }
  
    async sendWelcome() {
      await this.send('welcome', 'Welcome to the Natours Family!');
    }
  
    async sendPasswordReset() {
      await this.send(
        'resetPass',
        'Your password reset token (valid for only 10 minutes)'
      );
    }
  };











//module.exports = sendMail