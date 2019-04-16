const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/* sgMail.send({
  to: 'white.nuzzle@gmail.com',
  from: 'white.nuzzle@gmail.com',
  subject: 'This is my first creation!',
  text: 'I hope this one actually get to you.',
}); */

const sendWelcomeEmail = (email, name) => {
  sgMail.send({ // sgMail.send returns promise
    to: email,
    from: 'white.nuzzle@gmail.com',
    subject: 'Thanks for joining in!',
    text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
  });
};

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'white.nuzzle@gmail.com',
    subject: 'Sorry to see yo go!',
    text: `Goodbye, ${name}. I hope to see you back sometime soon.`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail,
};