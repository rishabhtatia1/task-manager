const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

const sendWelcomeMail = (email, name) => {
  sgMail.send({
    to: email,
    from: "rishabhtatia1@gmail.com",
    subject: "Thanky you for joining in!",
    text: `Welcome to the app, ${name}. Let me know how you get along with the app`,
  });
};

const sendCancelMail = (email, name) => {
  sgMail.send({
    to: email,
    from: "rishabhtatia1@gmail.com",
    subject: "Sorry to see you go!",
    text: `Goodbye, ${name}. I hope to see you back soon.`,
  });
};
module.exports = {
  sendWelcomeMail,
  sendCancelMail,
};
