import { ConfigService } from '@nestjs/config';
import { Transporter } from 'nodemailer';
export declare class EmailService {
    private configService;
    transporter: Transporter;
    constructor(configService: ConfigService);
    sendMail(params: {
        to: string;
        subject: string;
        html?: any;
    }): Promise<boolean>;
}
