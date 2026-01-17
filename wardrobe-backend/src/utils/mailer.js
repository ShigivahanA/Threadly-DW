import nodemailer from 'nodemailer'
import env from '../config/env.js'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  pool: true,
  maxConnections: 3,
  maxMessages: 100,
  auth: {
    user: env.email.user,
    pass: env.email.pass
  }
})

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
  attachments = []
}) => {
  await transporter.sendMail({
    from: `"Wardrobe" <${env.email.user}>`,
    to,
    subject,
    html,
    text,
    attachments
  })
}

