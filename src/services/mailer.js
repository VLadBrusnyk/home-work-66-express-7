const nodemailer = require('nodemailer');
const config = require('../config');

function createTransport() {
    if (config.SMTP_HOST && config.SMTP_PORT) {
        return nodemailer.createTransport({
            host: config.SMTP_HOST,
            port: Number(config.SMTP_PORT),
            secure: Boolean(config.SMTP_SECURE),
            auth: config.SMTP_USER
                ? {
                    user: config.SMTP_USER,
                    pass: config.SMTP_PASS,
                }
                : undefined,
        });
    }

    return nodemailer.createTransport({
        jsonTransport: true,
    });
}

const transport = createTransport();

async function sendMail({ to, subject, text, html }) {
    const from = config.MAIL_FROM || 'no-reply@example.com';
    const info = await transport.sendMail({ from, to, subject, text, html });

    if (transport.options && transport.options.jsonTransport) {
        // Dev fallback: prints email content to console
        // eslint-disable-next-line no-console
        console.log('Email (dev jsonTransport):', JSON.stringify(info.message, null, 2));
    }

    return info;
}

module.exports = { sendMail };
