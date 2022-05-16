import nodemailer from "nodemailer";
require("dotenv").config();

const env = process.env;
const props = {
  user: env.USER,
  pass: env.PASSWORD,
};

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: env.HOST,
  port: env.PORT,
  secure: true,
  auth: props,
});

// setup e-mail data with unicode symbols
const mailOptionss = {
  from: props.user, // sender address
  to: ["krishnankuttyveda@gmail.com", "sodadasumohankrishna066@gmail.com"], // list of receivers
  subject: "Hello ✔", // Subject line
  text: "Hello world ?", // plaintext body
  html: "<h1>Hello team</h1>", // html body
};

export const replaceAll = (target, pattern, value) => {
  return target.replace(new RegExp(pattern, "g"), value);
};

export const sendRawMail = (mailOpt) => {
  const mailOptions = {
    ...mailOpt,
    from: env.FROM,
    to: mailOpt.email,
    html: mailOpt.body,
  };

  console.log(mailOptions, "TEST");
  return new Promise((resolve, reject) => {
    if (typeof mailOptions !== "object") {
      reject(false);
    } else {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log("Error sending email", err);
        } else {
          resolve("success");
          console.log("Email sent successfully");
        }
      });
    }
  });
};

export const buildEmailData = (template, emailDynamicData) => {
  let { htmlPart, subject, dynamicKeys } = template;
  dynamicKeys.forEach((key) => {
    htmlPart = replaceAll(htmlPart, `{{${key}}}`, emailDynamicData[key]);
    subject = replaceAll(subject, `{{${key}}}`, emailDynamicData[key]);
  });
  return {
    htmlBody: htmlPart,
    subject,
  };
};

export const sendMail = async ({ template, mailProps, dynamicData }) => {
  const { htmlBody, subject } = buildEmailData(template, dynamicData);
  return new Promise((resolve, reject) => {
    if (typeof mailProps !== "object") {
      reject(false);
    } else {
      const mailOptions = {
        from: props.user,
        subject: subject,
        html: htmlBody,
        to: mailProps.to || null,
        cc: mailProps.cc || null,
        bcc: mailProps.bcc || null,
        attachments: mailProps.attachments || null,
      };
      //console.log(mailOptions.to, "to mail")

      // send email
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log("Error sending email", err);
        } else {
          resolve("success");
          console.log("Email sent successfully", "=>", mailOptions.to);
        }
      });
    }
  });
};
