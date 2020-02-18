"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mailer_constants_1 = require("./mailer.constants");
const nodemailer_1 = require("nodemailer");
exports.createMailerClient = () => ({
    provide: mailer_constants_1.MAILER_TOKEN,
    useFactory: (options) => {
        return nodemailer_1.createTransport(options);
    },
    inject: [mailer_constants_1.MAILER_MODULE_OPTIONS],
});
