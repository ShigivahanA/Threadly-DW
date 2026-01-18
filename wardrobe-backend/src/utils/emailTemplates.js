export const welcomeEmail = (name = '') => ({
  subject: 'Welcome to Threadly',
  text: `Welcome to Threadly${name ? `, ${name}` : ''}! Your account is ready.`,
  html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Welcome to Threadly</title>
</head>
<body style="margin:0;padding:0;background:#f7f7f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td align="center" style="padding:48px 16px;">

<table width="100%" cellpadding="0" cellspacing="0" role="presentation"
style="max-width:480px;background:#ffffff;border-radius:20px;padding:40px 32px;box-shadow:0 20px 40px rgba(0,0,0,0.08);">

<tr>
<td align="center" style="padding-bottom:28px;">
<img src="https://res.cloudinary.com/dax0gizdq/image/upload/v1768669039/logoo_kngfmc.png" alt="Threadly" width="120" style="display:block;opacity:0.9;" />
</td>
</tr>

<tr>
<td align="center" style="padding-bottom:16px;">
<h2 style="margin:0;font-size:20px;font-weight:600;color:#111;">
Welcome${name ? `, ${name}` : ''} 👋
</h2>
</td>
</tr>

<tr>
<td align="center">
<p style="margin:0;font-size:14px;color:#666;max-width:360px;line-height:1.6;">
Your Threadly account has been created successfully.  
You can now start organizing outfits and managing your digital Threadly.
</p>
</td>
</tr>

</table>

<p style="margin-top:24px;font-size:11px;color:#aaa;">
© ${new Date().getFullYear()} Threadly
</p>

</td>
</tr>
</table>

</body>
</html>
`
})


export const loginAlertEmail = ({ device, ip }) => ({
  subject: 'New login to your Threadly account',
  text: `New login detected. Device: ${device}, IP: ${ip}`,
  html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#f7f7f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:48px 16px;">

<table width="100%" cellpadding="0" cellspacing="0"
style="max-width:480px;background:#fff;border-radius:20px;padding:40px 32px;box-shadow:0 20px 40px rgba(0,0,0,0.08);">

<tr>
<td align="center" style="padding-bottom:28px;">
<img src="https://res.cloudinary.com/dax0gizdq/image/upload/v1768669039/logoo_kngfmc.png" width="120" />
</td>
</tr>

<tr>
<td align="center" style="padding-bottom:12px;">
<h2 style="margin:0;font-size:20px;font-weight:600;color:#111;">
New login detected
</h2>
</td>
</tr>

<tr>
<td align="center">
<p style="font-size:14px;color:#666;line-height:1.6;">
We noticed a new login to your account.
</p>

<p style="font-size:13px;color:#777;">
<strong>Device:</strong> ${device}<br/>
<strong>IP:</strong> ${ip}
</p>

<p style="font-size:12px;color:#999;">
If this wasn’t you, please change your password immediately.
</p>
</td>
</tr>

</table>

<p style="margin-top:24px;font-size:11px;color:#aaa;">
© ${new Date().getFullYear()} Threadly
</p>

</td>
</tr>
</table>

</body>
</html>
`
})


export const passwordChangedEmail = () => ({
  subject: 'Your Threadly password was changed',
  text: 'Your password was successfully changed.',
  html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#f7f7f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:48px 16px;">

<table width="100%" cellpadding="0" cellspacing="0"
style="max-width:480px;background:#fff;border-radius:20px;padding:40px 32px;box-shadow:0 20px 40px rgba(0,0,0,0.08);">

<tr>
<td align="center" style="padding-bottom:28px;">
<img src="https://res.cloudinary.com/dax0gizdq/image/upload/v1768669039/logoo_kngfmc.png" width="120" />
</td>
</tr>

<tr>
<td align="center" style="padding-bottom:12px;">
<h2 style="margin:0;font-size:20px;font-weight:600;color:#111;">
Password updated
</h2>
</td>
</tr>

<tr>
<td align="center">
<p style="font-size:14px;color:#666;line-height:1.6;">
Your Threadly password was changed successfully.
</p>

<p style="font-size:12px;color:#999;">
If this wasn’t you, reset your password immediately.
</p>
</td>
</tr>

</table>

<p style="margin-top:24px;font-size:11px;color:#aaa;">
© ${new Date().getFullYear()} Threadly
</p>

</td>
</tr>
</table>

</body>
</html>
`
})


export const passwordResetSuccessEmail = () => ({
  subject: 'Your Threadly password was reset',
  text: 'Your password has been reset successfully.',
  html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#f7f7f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:48px 16px;">

<table width="100%" cellpadding="0" cellspacing="0"
style="max-width:480px;background:#fff;border-radius:20px;padding:40px 32px;box-shadow:0 20px 40px rgba(0,0,0,0.08);">

<tr>
<td align="center" style="padding-bottom:28px;">
<img src="https://res.cloudinary.com/dax0gizdq/image/upload/v1768669039/logoo_kngfmc.png" width="120" />
</td>
</tr>

<tr>
<td align="center" style="padding-bottom:12px;">
<h2 style="margin:0;font-size:20px;font-weight:600;color:#111;">
Password reset successful
</h2>
</td>
</tr>

<tr>
<td align="center">
<p style="font-size:14px;color:#666;line-height:1.6;">
Your Threadly password has been reset successfully.
</p>

<p style="font-size:12px;color:#999;">
If you didn’t perform this action, contact support immediately.
</p>
</td>
</tr>

</table>

<p style="margin-top:24px;font-size:11px;color:#aaa;">
© ${new Date().getFullYear()} Threadly
</p>

</td>
</tr>
</table>

</body>
</html>
`
})




export const otpEmail = (otp) => {
  const digits = otp.split('')

  return {
    subject: 'Your Threadly Login Code',
    text: `Your login code is ${otp}. It expires in 5 minutes.`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Your Login Code</title>
</head>
<body style="
  margin:0;
  padding:0;
  background:#f7f7f7;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,Arial,sans-serif;
">

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding:48px 16px;">
        
        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
          style="
            max-width:480px;
            background:#ffffff;
            border-radius:20px;
            padding:40px 32px;
            box-shadow:0 20px 40px rgba(0,0,0,0.08);
          "
        >
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <img
                src="https://res.cloudinary.com/dax0gizdq/image/upload/v1768669039/logoo_kngfmc.png"
                alt="Threadly"
                width="120"
                style="display:block;opacity:0.9;"
              />
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td align="center" style="padding-bottom:6px;">
              <h2 style="
                margin:0;
                font-size:20px;
                font-weight:600;
                color:#111;
              ">
                Your login code
              </h2>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-bottom:24px;">
              <p style="
                margin:0;
                font-size:14px;
                color:#666;
                max-width:360px;
              ">
                Use the code below to sign in securely to your Threadly account.
              </p>
            </td>
          </tr>

          <!-- OTP boxes -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <table cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  ${digits.map(d => `
                    <td style="padding:0 6px;">
                      <div style="
                        width:44px;
                        height:52px;
                        line-height:52px;
                        text-align:center;
                        border-radius:12px;
                        border:1px solid #e5e5e5;
                        font-size:22px;
                        font-weight:600;
                        color:#111;
                        background:#fafafa;
                      ">
                        ${d}
                      </div>
                    </td>
                  `).join('')}
                </tr>
              </table>
            </td>
          </tr>

          <!-- Reassurance message -->
          <tr>
            <td align="center" style="padding-bottom:8px;">
              <p style="
                margin:0;
                font-size:13px;
                color:#777;
                max-width:360px;
                line-height:1.6;
              ">
                This code is valid for <strong>5 minutes</strong> and can only be used once.
              </p>
            </td>
          </tr>

          <tr>
            <td align="center">
              <p style="
                margin:0;
                font-size:12px;
                color:#999;
                line-height:1.6;
              ">
                If you didn’t request this login, you can safely ignore this email.
              </p>
            </td>
          </tr>

        </table>

        <!-- Footer -->
        <p style="
          margin-top:24px;
          font-size:11px;
          color:#aaa;
        ">
          © ${new Date().getFullYear()} Threadly
        </p>

      </td>
    </tr>
  </table>

</body>
</html>
    `
  }
}



export const resetPasswordEmail = (resetLink) => ({
  subject: 'Reset your Threadly password',
  text: `
You requested a password reset for your Threadly account.

Open the link below to set a new password.
This link is valid for 15 minutes.

${resetLink}

If you didn’t request this, you can safely ignore this email.
  `,
  html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Reset your password</title>
</head>
<body style="
  margin:0;
  padding:0;
  background:#f7f7f7;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,Arial,sans-serif;
">

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding:48px 16px;">

        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
          style="
            max-width:480px;
            background:#ffffff;
            border-radius:20px;
            padding:40px 32px;
            box-shadow:0 20px 40px rgba(0,0,0,0.08);
          "
        >

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <img
                src="https://res.cloudinary.com/dax0gizdq/image/upload/v1768669039/logoo_kngfmc.png"
                alt="Threadly"
                width="120"
                style="display:block;opacity:0.9;"
              />
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td align="center" style="padding-bottom:6px;">
              <h2 style="
                margin:0;
                font-size:20px;
                font-weight:600;
                color:#111;
              ">
                Reset your password
              </h2>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-bottom:24px;">
              <p style="
                margin:0;
                font-size:14px;
                color:#666;
                max-width:360px;
                line-height:1.6;
              ">
                We received a request to reset the password for your Threadly account.
              </p>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <a
                href="${resetLink}"
                style="
                  display:inline-block;
                  padding:14px 26px;
                  border-radius:999px;
                  background:#111;
                  color:#ffffff;
                  text-decoration:none;
                  font-size:14px;
                  font-weight:500;
                "
              >
                Set new password
              </a>
            </td>
          </tr>

          <!-- Reassurance -->
          <tr>
            <td align="center" style="padding-bottom:8px;">
              <p style="
                margin:0;
                font-size:13px;
                color:#777;
                max-width:360px;
                line-height:1.6;
              ">
                This link is valid for <strong>15 minutes</strong> and can only be used once.
              </p>
            </td>
          </tr>

          <tr>
            <td align="center">
              <p style="
                margin:0;
                font-size:12px;
                color:#999;
                line-height:1.6;
              ">
                If you didn’t request a password reset, you can safely ignore this email.
              </p>
            </td>
          </tr>

        </table>

        <!-- Footer -->
        <p style="
          margin-top:24px;
          font-size:11px;
          color:#aaa;
        ">
          © ${new Date().getFullYear()} Threadly
        </p>

      </td>
    </tr>
  </table>

</body>
</html>
  `
})


export const changePasswordOtpEmail = (otp) => {
  const digits = otp.split('')

  return {
    subject: 'Confirm your password change',
    text: `Your password change verification code is ${otp}. It expires in 5 minutes.`,
    html: `
<!DOCTYPE html>
<html>
<body style="
  margin:0;
  padding:0;
  background:#f7f7f7;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,Arial,sans-serif;
">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:48px 16px;">
        <table width="100%" style="
          max-width:480px;
          background:#ffffff;
          border-radius:20px;
          padding:40px 32px;
          box-shadow:0 20px 40px rgba(0,0,0,0.08);
        ">
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <img
                src="https://res.cloudinary.com/dax0gizdq/image/upload/v1768669039/logoo_kngfmc.png"
                width="120"
                alt="Threadly"
              />
            </td>
          </tr>

          <tr>
            <td align="center">
              <h2 style="margin:0;font-size:20px;color:#111;">
                Confirm password change
              </h2>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:20px 0;">
              <p style="font-size:14px;color:#666;max-width:360px;">
                You requested to change your Threadly password.
                Enter the code below to continue.
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-bottom:24px;">
              <table>
                <tr>
                  ${digits.map(d => `
                    <td style="padding:0 6px;">
                      <div style="
                        width:44px;
                        height:52px;
                        line-height:52px;
                        text-align:center;
                        border-radius:12px;
                        border:1px solid #e5e5e5;
                        font-size:22px;
                        font-weight:600;
                        background:#fafafa;
                      ">
                        ${d}
                      </div>
                    </td>
                  `).join('')}
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center">
              <p style="font-size:12px;color:#999;line-height:1.6;">
                This code expires in <strong>5 minutes</strong>.<br/>
                If you didn’t request this change, secure your account immediately.
              </p>
            </td>
          </tr>
        </table>

        <p style="margin-top:24px;font-size:11px;color:#aaa;">
          © ${new Date().getFullYear()} Threadly
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`
  }
}
