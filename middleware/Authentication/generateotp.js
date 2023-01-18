const generateotp = async (email, hash, username) => {
    const nodemailer = require('nodemailer');
    let smtpTransport = require('nodemailer-smtp-transport');

    const redisConnection = require('../../config/redis')
    const otp = String(Math.floor(Math.random() * 99999) + 11111);
    const { v4: uuid } = require('uuid');// install uuid package
    const uniqueId = uuid(); // generate unique identifier

    const saveOtpToRedis = async () => {
        const redis = redisConnection()
        const key = `${email}:${uniqueId}`;

        await redis.lpush(key, otp, email, hash, username, async (err, res) => {
            if (err) {
                console.log('err is comming while seting the otp email hash username in redis', err)
            } else {
                await redis.expire(key, 180, (err, res) => {
                    if (err) {
                        console.log(`Error: ${err}`);
                    } else {
                        console.log(`Expiration set for key ${key}`);
                    }
                });
                console.log(otp, 'this is otp before redis');
            }
        });

        await redis.lrange(key, 0, -1, (err, res) => {
            if (err) {
                console.log('err in geting the otp and other email hash username from redis agter setting', err);
            } else {
                console.log(res, 'this is key');
            }
        })
    }

    let texting = 'hello brother'
    let htmll = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <style>
          h1 {
            color: red;
            text-decoration: wavy;
          }
        </style>
      </head>
      <body>
        <h1 id="hii">${otp}</h1>
      </body>
    </html>`

    const sendOtpEmail = async () => {
        console.log(email, 'this is email');
        console.log(otp, typeof (otp));
        console.log('find in 40');
        smtpTransport = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            auth: {
                user: 'adrianlamo001.eluminati.co@gmail.com',
                pass: 'rqonssndnnmnjkjc'
            }
        }));
        console.log('fine in 48')
        const mailOptions = {
            from: 'adrianlamo001.eluminati.co@gmail.com',
            to: email,
            subject: 'test subject',
            text: 'https://google.com ',
            html: htmll
        }

        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log('error while sending mail', error);
            }
        });
    }

    await saveOtpToRedis()
    await sendOtpEmail()

    return uniqueId

}

module.exports = generateotp