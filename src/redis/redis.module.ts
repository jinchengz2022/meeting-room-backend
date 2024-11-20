import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory(configService: ConfigService) {
        const client = createClient({
          socket: {
            host: configService.get('redis_service_host'),
            port: configService.get('redis_service_port'),
          },
          database: configService.get('redis_service_database'),
        });
        await client.connect();
        return client;
      },
      inject: [ConfigService]
    },
  ],
  
  exports: [RedisService],
})
export class RedisModule {}
