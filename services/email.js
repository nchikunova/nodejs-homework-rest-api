const Mailgen = require('mailgen')
require('dotenv').config()

class EmailService {
  constructor(env, sender) {
    this.sender = sender
    switch (env) {
      case 'development':
        this.link = 'http://localhost:3000'
        break
      case 'production':
        this.link = 'link for production'
        break
      default:
        this.link = 'http://localhost:3000'
        break
    }
  }
  #createTemplateVerificationEmail(verifyToken, email) {
    const mailGenerator = new Mailgen({
      theme: 'cerberus',
      product: {
        name: 'Contacts book',
        link: this.link,
      },
    })

    const emailSend = {
      body: {
        email,
        intro: 'Welcome to Contacts book! We are very excited to have you on a board.',
        action: {
          instructions: 'To get started, please, click here:',
          button: {
            color: '#22BC66',
            text: 'Confirm your account',
            link: `${this.link}/api/users/verify/${verifyToken}`,
          },
        },
      },
    }
    return mailGenerator.generate(emailSend)
  } 
  async sendVerifyEmail(verifyToken, email) {
    const emailHtml = this.#createTemplateVerificationEmail(verifyToken, email)
    const msg = {
      to: email,
      subject: 'Verify your account',
      html: emailHtml,
    }
    const result = await this.sender.send(msg)
    console.log(result)
  }
}

module.exports = EmailService