import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
})

const mailOptions = {
  from: process.env.MAIL_FROM_ADDRESS,
  to: '',
  subject: '',
  text: null,
  html: null,
}

export default async function email(user = {}, subject = '', text = null, html = null) {
  return new Promise((resolve, reject) => {
    mailOptions.to = user.email
    mailOptions.subject = subject
    mailOptions.text = text
    mailOptions.html = html
    transporter.sendMail(mailOptions)
      .then(() => {
        resolve(true)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
