import asyncHandler from '../utils/asyncHandler.js'
import AppError from '../utils/AppError.js'
import { successResponse } from '../utils/response.js'
import nodemailer from 'nodemailer'

export const sendContactMessage = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body

  if (!email || !message) {
    throw new AppError('Email and message are required', 400)
  }

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  await transporter.sendMail({
    from: `"Wardrobe Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.CONTACT_RECEIVER,
    replyTo: email,
    subject: 'New contact message',
    text: `
Name: ${name || '—'}
Email: ${email}

Message:
${message}
    `
  })

  successResponse(res, {
    message: 'Message sent successfully',
    data: null
  })
})
