import nodeMailer from 'nodemailer';

const mailer = nodeMailer.createTransport({
    service: 'gmail',
    pool: true,
    port: 465,
    secure: true, // use TLS
    auth: {
      user: "test.paper.id@gmail.com",
      pass: "ekofebri"
    }
  });

  export default mailer;