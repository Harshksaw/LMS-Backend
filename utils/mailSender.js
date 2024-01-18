const nodemailer = require('nodemailer');


const mailSender = async(email, title  , body) => {
    try {
        let transport = nodemailer.createTransport({
            host: process.env.HOST,
            port: process.env.PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })

        let info = await transport.sendMail({
            from: process.env.MAIL_USER,
            to: `${email}`,
            subject:` ${title}`,
            text: `${body}`,
        })
            console.log(info)
                return info;

    } catch (error) {
        console.log(error.message)
  }


};

module.exports = mailSender;