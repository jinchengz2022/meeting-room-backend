import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';

// import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      host: this.configService.get('nodemailer_host') ,
      port: this.configService.get('nodemailer_port'),
      secure: false,
      auth: {
        user: this.configService.get('nodemailer_user'),
        pass: this.configService.get('nodemailer_pass'),
      },
    });
  }

  async sendMail(params: { to: string; subject: string; html?: any }) {
    const { to, subject, html } = params;
    await this.transporter.sendMail({
      from: {
        name: '会议名称',
        address: this.configService.get('nodemailer_user'),
      },
      to,
      subject,
      html,
    });

    return true;
  }
}
