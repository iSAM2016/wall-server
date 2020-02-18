export declare const createMailerClient: <T>() => {
    provide: string;
    useFactory: (options: T) => import("nodemailer/lib/mailer");
    inject: string[];
};
