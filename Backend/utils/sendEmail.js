const sendEmail = async (to, subject, htmlContent) => {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'Mockly',
          email: process.env.BREVO_SENDER_EMAIL || 'noreply@mockly.com',
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: htmlContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Brevo API error: ${response.status}`);
    }

    console.log('Email sent successfully via Brevo');
  } catch (error) {
    console.error('Email Error:', error.message);
  }
};

export default sendEmail;
