/**
 * Verification Code Email Template
 * @param {string|number} verificationCode 
 * @returns {string} HTML email string
 */
export const verificationEmailTemplate = (verificationCode) => {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #ffffff; padding: 20px; text-align: center; border: 1px solid #000000; border-radius: 8px; max-width: 500px; margin: auto;">
    <h2 style="color: #000000; margin-bottom: 10px;">InterviewPrep</h2>
    <p style="color: #333333; font-size: 16px; margin-bottom: 20px;">
      Please verify your email to complete registration.
    </p>
    <div style="background-color: #000000; color: #ffffff; padding: 15px; font-size: 22px; font-weight: bold; border-radius: 6px; display: inline-block; letter-spacing: 4px;">
      ${verificationCode}
    </div>
    <p style="color: #555555; font-size: 14px; margin-top: 20px;">
      Enter this code in the app to activate your account.<br>
      If you didn’t request this, you can safely ignore this email.
    </p>
    <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
    <p style="color: #888888; font-size: 12px;">
      &copy; ${new Date().getFullYear()} InterviewPrep. All rights reserved.
    </p>
  </div>
  `;
};

/**
 * Generic Base Email Template
 * @param {Object} options
 * @param {string} options.title
 * @param {string} options.message
 * @param {string} [options.highlightText]
 * @returns {string} HTML email string
 */
export const baseEmailTemplate = ({ title, message, highlightText = "" }) => {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #ffffff; padding: 20px; text-align: center; border: 1px solid #000000; border-radius: 8px; max-width: 500px; margin: auto;">
    <h2 style="color: #000000; margin-bottom: 10px;">${title || "InterviewPrep"}</h2>
    <p style="color: #333333; font-size: 16px; margin-bottom: 20px;">
      ${message}
    </p>
    ${
      highlightText
        ? `<div style="background-color: #000000; color: #ffffff; padding: 15px; font-size: 22px; font-weight: bold; border-radius: 6px; display: inline-block; letter-spacing: 4px;">
            ${highlightText}
           </div>`
        : ""
    }
    <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
    <p style="color: #888888; font-size: 12px;">
      &copy; ${new Date().getFullYear()} InterviewPrep. All rights reserved.
    </p>
  </div>
  `;
};
