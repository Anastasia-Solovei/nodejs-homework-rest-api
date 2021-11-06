const Mailgen = require("mailgen");

class EmailService {
  constructor(env, sender) {
    this.sender = sender;
    switch (env) {
      case "development":
        this.link = "https://e826-188-163-43-104.ngrok.io";
        break;

      case "production":
        this.link = "https://goit-react-hw-08-phonebook-av-solovei.netlify.app";
        break;

      default:
        break;
    }
  }

  createTemplateEmail(name, verificationToken) {
    const mailGenerator = new Mailgen({
      theme: "salted",
      product: {
        name: "Phonebook service",
        link: this.link,
      },
    });

    const email = {
      body: {
        name,
        intro:
          "Welcome to Phonebook service! We're very excited to have you on board.",
        action: {
          instructions:
            "To get started with Phonebook service, please click here:",
          button: {
            color: "#22BC66", // Optional action button color
            text: "Confirm your account",
            link: `${this.link}/api/users/verify/${verificationToken}`,
          },
        },
      },
    };

    return mailGenerator.generate(email);
  }

  async sendVerifyEmail(email, name, verificationToken) {
    const emailHTML = this.createTemplateEmail(name, verificationToken);
    const msg = {
      to: email,
      subject: "Verify your email",
      html: emailHTML,
    };
    try {
      const result = await this.sender.send(msg);
      console.log(result);
      return true;
    } catch (err) {
      console.log(err.message);
      return false;
    }
  }
}

module.exports = EmailService;
