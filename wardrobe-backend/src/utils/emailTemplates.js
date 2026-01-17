export const otpEmail = (otp) => ({
  subject: 'Your Wardrobe Login OTP',
  text: `Your login OTP is ${otp}. It expires in 5 minutes.`,
  html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Your Login OTP</h2>
      <p>Use the OTP below to log in:</p>
      <h1 style="letter-spacing: 4px;">${otp}</h1>
      <p>This OTP is valid for <strong>5 minutes</strong>.</p>
      <p>If you didn’t request this, you can ignore this email.</p>
    </div>
  `
})


export const resetPasswordEmail = (resetLink) => ({
  subject: 'Reset your Wardrobe password',
  text: `
You requested a password reset.

Open the link below to set a new password.
This link is valid for 15 minutes.

${resetLink}

If you didn’t request this, you can safely ignore this email.
  `,
  html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Password Reset</h2>
      <p>You requested a password reset.</p>
      <p>
        <a href="${resetLink}" style="
          display: inline-block;
          padding: 10px 16px;
          background: #000;
          color: #fff;
          text-decoration: none;
          border-radius: 6px;
        ">
          Reset Password
        </a>
      </p>
      <p>This link is valid for <strong>15 minutes</strong>.</p>
      <p>If you didn’t request this, you can ignore this email.</p>
    </div>
  `
})
