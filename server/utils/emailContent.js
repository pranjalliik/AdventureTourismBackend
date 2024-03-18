

module.exports.welcome = function welcome(user){

  
let str = `
Hello ${user},

Welcome to our platform! We are thrilled to have you on board.

Thank you for choosing our service. If you have any questions or need assistance, feel free to reach out to our support team.

Best regards,
Your Company
`
 return str
};

module.exports.resetPass = function resetPass( user,resetLink) {
    const emailContent = `
    Hello ${user},
  
    You are receiving this email because a password reset request has been initiated for your account.
  
    If you did not request a password reset, please ignore this email.
  
    To reset your password, click on the following link:
    ${resetLink}
  
    If the link doesn't work, copy and paste it into your browser.
    
    If you have any questions or need assistance, please contact our support team.
  
    Best regards,
    Your Company
    `;
  return emailContent
  };