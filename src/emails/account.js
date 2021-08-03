const sgMail = require("@sendgrid/mail");
const sendGridApiKey = "";

sgMail.setApiKey(sendGridApiKey);

const sendWelcomeMail = (email, name) => {
  sgMail.send({
    to: email,
    from: "rishabhtatia1@gmail.com",
    to: "Thanky you for joining in!",
    text: `Welcome to the app, ${name}. Let me know how you get along with the app`,
  });
};

const sendCancelMail = (email, name) => {
  sgMail.send({
    to: email,
    from: "rishabhtatia1@gmail.com",
    to: "Sorry to see you go!",
    text: `Goodbye, ${name}. I hope to see you back soon.`,
  });
};

module.exports = {
  sendWelcomeMail,
  sendCancelMail,
};
