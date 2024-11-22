import { Controller, Get, Query, Inject } from '@nestjs/common';
import { EmailService } from './email.service';
import { RedisService } from 'src/redis/redis.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Inject()
  private redisService: RedisService;

  @Get('getCode')
  async getCode(@Query('address') address) {
    const code = Math.random().toString().substring(2, 8);

    await this.emailService.sendMail({
      to: address,
      subject: '注册账号的验证码为：' + code,
    });

    this.redisService.set(`captcha_${address}`, code);

    return {
      data: true,
      message: '',
    };
  }
}
